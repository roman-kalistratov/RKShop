import mongoose from "mongoose";

var favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        id: Number,
        title: String,
        description: String,
        category:String,
        brand: String,
        rating: Number,
        price: Number,
        discountPercentage: Number,
        images: Array,
        thumbnail: String,
      },
    ],
    count: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
