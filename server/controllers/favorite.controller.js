import e from "express";
import favoriteModel from "../models/favorite.model.js";

const addFavorite = async (req, res) => {
  try {
    const { product } = req.body;
    const userId = req.user._id.toString();

    let favorite = await favoriteModel.findOne({ userId });

    if (!favorite) {
      favorite = new favoriteModel({ userId });
    }

    // Check if the product already exists in the favorities
    const existingProduct = favorite.products.find(
      (item) => item.id === product.id
    );

    // If the product already exists, increase its quantity
    if (!existingProduct) {
      favorite.products.push(product);
    } else {
      return res.status(400).json("Product already exist in wishlist");
    }

    favorite.count = favorite.products.length;
    await favorite.save();

    return res.status(200).json(favorite);
  } catch (err) {
    console.log("Error adding product to the favorite list:", err);
  }
};

const removeFavorite = async (req, res) => {
  const userId = req.user._id.toString();
  const { productId } = req.params;

  try {
    const favorite = await favoriteModel.findOne({ userId });
    if (!favorite) return null;

    const productIndex = favorite.products.findIndex(
      (item) => item.id.toString() === productId
    );

    if (productIndex === -1) {
      console.log("Product not found in the favorite list.");
      return;
    }

    favorite.products.splice(productIndex, 1);

    await favorite.save();

    return res.status(200).json(favorite);
  } catch (err) {
    console.log("Error deleting product of the favorite list:", err);
  }
};

const getFavoritesOfUser = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    const favorite = await favoriteModel.findOne({ userId });

    if (!favorite || favorite.products.length === 0) {
      return null;
    }
    return res.status(200).json(favorite);
  } catch (err) {
    console.log(err);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
