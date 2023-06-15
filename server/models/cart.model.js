import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          id: Number,
          title: String,
          price: Number,
          discountPercentage: Number,
          image: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    count:Number
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
