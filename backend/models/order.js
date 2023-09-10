const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Object,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: Object,
      required: true,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// orderSchema.methods.addorder = function (address, products, userId) {
//   console.log(address, products, userId);
// };

module.exports = mongoose.model("Order", orderSchema);
