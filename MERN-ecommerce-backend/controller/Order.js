const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  // here we have to update stocks;

  for (let item of order.items) {
    let product = await Product.findOne({ _id: item.product.id });
    product.$inc("stock", -1 * item.quantity);
    // for optimum performance we should make inventory outside of product.
    await product.save();
  }

  try {
    const doc = await order.save();
    const user = await User.findById(order.user);
    // we can use await for this also
    await sendMail({
      to: user.email,
      html: invoiceTemplate(order),
      subject: "Order Received",
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
      .populate("items.product")
      .exec();

    // Send additional content based on the status update
    let emailContent = "";
    let contactNumber = "+1(903) 990 7270";
    switch (status) {
      case "dispatched":
        emailContent = `Your order with product ${order.items
          .map((item) => item.product.title)
          .join(", ")} has been dispatched. Thank you for shopping with us!`;
        break;
      case "delivered":
        emailContent = `Your order with product ${order.items
          .map((item) => item.product.title)
          .join(
            ", "
          )} has been delivered successfully. We hope you are satisfied with your purchase. Thank you for shopping with us!`;

        // Include feedback form
        emailContent += `
          <br><br>
          <div>We'd love to hear your feedback on the products you purchased. Please take a moment to leave a review:</div>
          <form action="https://example.com/submit-feedback" method="post">
            <textarea name="feedback" rows="4" cols="50"></textarea><br>
            <input type="submit" value="Submit Feedback">
          </form>`;
        break;
      case "cancelled by seller":
        emailContent = `We regret to inform you that your order with product ${order.items
          .map((item) => item.product.title)
          .join(
            ", "
          )} has been cancelled. If you have any concerns, please feel free to contact us ${contactNumber}.`;
        break;
      case "cancelled by buyer":
        emailContent = `We hope this email finds you well. We wanted to inform you that your cancellation request with product ${order.items
          .map((item) => item.product.title)
          .join(
            ", "
          )} has been successfully processed. We're sorry to hear that you've decided to cancel your order, and we sincerely apologize for any inconvenience this may have caused. If you have any concerns, please feel free to contact us ${contactNumber}.`;
        break;
      default:
        break;
    }

    if (emailContent) {
      const user = await User.findById(order.user);
      await sendMail({
        to: user.email,
        html: `
          <div>Order Id - ${id}</div>
          <div>Current Status - ${status}</div>
          <div>${emailContent}</div>`,
        subject: `Order Status ${status}`,
      });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
