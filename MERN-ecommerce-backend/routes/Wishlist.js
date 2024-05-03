const express = require("express");
const {
  addToWishlist,
  fetchWishlistByUser,
  deleteFromWishlist,
  updateWishlist,
} = require("../controller/Wishlist");

const router = express.Router();
//  /wishlist is already added in base path
router
  .post("/", addToWishlist)
  .get("/", fetchWishlistByUser)
  .delete("/:id", deleteFromWishlist)
  .patch("/:id", updateWishlist);

exports.router = router;
