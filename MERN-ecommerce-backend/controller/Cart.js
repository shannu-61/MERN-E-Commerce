const { Cart } = require("../model/Cart");
const Bargain = require("../model/Bargain");

exports.fetchCartByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const cartItems = await Cart.find({ user: id }).populate("product").exec();
    for(const item of cartItems){
      try{
        console.log(item);
        const bargain = await Bargain.findOne({product: item.product._id, user: id}).exec();
      if(bargain && bargain.accepted){
        item.product.price = bargain.price;
      }
      }catch(err){
        console.log(err);
      }
      
    } 
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
