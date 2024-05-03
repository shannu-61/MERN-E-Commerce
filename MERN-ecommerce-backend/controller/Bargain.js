const Bargain = require("../model/Bargain");
const { sendMail } = require("../services/common");

exports.createBargain = async (req, res) => {
  try {
    const prevBargain = await Bargain.findOne({
      product: req.body.product,
      user: req.body.user,
    }).exec();
    if (prevBargain) {
      await Bargain.findByIdAndDelete(prevBargain._id).exec();
    }

    const bargain = new Bargain(req.body);
    const doc = await bargain.save();

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchBargains = async (req, res) => {
  try {
    const bargains = await Bargain.find({}).exec();
    res.status(200).json(bargains);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchBargainsOfProductByUser = async (req, res) => {
  try {
    const bargains = await Bargain.find({
      product: req.params.productId,
      user: req.params.userId,
    }).exec();
    res.status(200).json(bargains);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.acceptBargain = async (req, res) => {
  try {
    const bargain = await Bargain.findById(req.params.id)
      .populate("product")
      .populate("user")
      .exec();
    bargain.accepted = true;
    const doc = await bargain.save();

    // Send email notification to user
    await sendMail({
      to: bargain.user.email,
      subject: "Your Bargain Request has been Accepted by Seller",
      text: `Your bargain request for product "${bargain.product.title}" has been accepted. The accepted price is $${bargain.price}.`,
    });

    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.rejectBargain = async (req, res) => {
  try {
    const bargain = await Bargain.findById(req.params.id)
      .populate("product")
      .populate("user")
      .exec();
    bargain.rejected = true;
    const doc = await bargain.save();

    // Send email notification to user
    await sendMail({
      to: bargain.user.email,
      subject: "Your Bargain Request has been Rejected by Seller",
      text: `Your bargain request for product "${bargain.product.title}" has been Rejected.`,
    });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteBargain = async (req, res) => {
  try {
    const doc = await Bargain.findByIdAndDelete(req.params.id).exec();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
