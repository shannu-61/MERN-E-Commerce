const { Wishlist } = require("../model/Wishlist");

exports.fetchWishlistByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const wishlistItems = await Wishlist.find({ user: id }).populate("product");

    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToWishlist = async (req, res) => {
  const { id } = req.user;
  const wishlist = new Wishlist({ ...req.body, user: id });
  try {
    const doc = await wishlist.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Wishlist.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const wishlist = await Wishlist.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await wishlist.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
