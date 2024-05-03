const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  review: { type: String, required: true },
});

module.exports = mongoose.model("Review", ReviewSchema);
