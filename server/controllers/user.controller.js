import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import couponModel from "../models/coupon.model.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import tokenService from "../config/generateTokens.js";
import sendEmail from "../service/mail-service.js";

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].msg);

    const checkEmail = await userModel.findOne({ email: email });

    if (checkEmail) return res.status(400).json("email already exists");

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(200).json({ ...user._doc, id: user.id });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].msg);

    const user = await userModel.findOne({ email: email });

    if (!user)
      return res.status(404).json(`user with email ${email} not exist.`);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password");

    const { accessToken, refreshToken } = tokenService.generateTokens({
      data: user.id,
    });

    await userModel.findByIdAndUpdate(
      user.id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      ...user._doc,
      token: accessToken,
    });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken").status(200).json("logout succeeded");
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return res.status(404).json("user not found");

    res.status(200).json(user);
  } catch {
    res.status(500).json("Something went wrong");
  }
};

const forgotPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json(`user with email ${email} not exist.`);

    const resetToken = await user.createPasswordResetToken(user);
    await user.save();
    
    sendEmail(email, resetToken);
    res.status(200).json("Password reset link is sent to tour email.");
  } catch (err) {
    res.status(500).json("Server side error.");
    console.log(err);
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await userModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) res.status(400).json("Token Expired, Please try again later");
  const hashPassword = await bcrypt.hash(password, 3);

  user.password = hashPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
};

const setCart = async (req, res) => {
  let { product, qty } = req.body;
  const userId = req.user._id.toString();

  product = product.product;

  try {
    // Find the user's cart by userId
    let cart = await cartModel.findOne({ userId });

    // If the user's cart doesn't exist, create a new one
    if (!cart) {
      cart = new cartModel({ userId });
    }

    // Check if the product already exists in the cart
    const existingProduct = cart.products.find(
      (item) => item.product.id === product.id
    );

    // If the product already exists, increase its quantity
    if (existingProduct) {
      existingProduct.quantity += qty > 1 ? qty : 1;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.products.push({ product, quantity: qty });
    }

    // Calculate the total cart value and total with discount
    let cartTotal = 0;
    let cartCount = 0;
    cart.products.forEach((item) => {
      const { price } = item.product;
      const quantity = item.quantity;

      cartTotal += price * quantity;
      cartCount += quantity;
    });

    // Update the cart's total values
    cart.cartTotal = cartTotal;
    cart.totalAfterDiscount = 0;
    cart.count = cartCount;

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.log("Error adding product to the cart:", err);
  }
};

const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await cartModel.findOne({ userId });

    // If the cart is not found, display an error message
    if (!cart || cart.products.length === 0) {
      return null;
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error retrieving the cart:", err);
  }
};

const updateCart = async (req, res) => {
  const { productId, state } = req.body;
  const userId = req.user._id.toString();

  try {
    const cart = await cartModel.findOne({ userId });

    // If the cart is not found, display an error message
    if (!cart || cart.products.length === 0) {
      return null;
    }

    const existingProduct = cart.products.find(
      (item) => item.product.id === productId
    );

    switch (state) {
      case "increase":
        existingProduct.quantity += 1;
        break;

      case "decrease":
        if (existingProduct.quantity > 1) existingProduct.quantity -= 1;
        break;
      case "delete":
        await cartModel.findOneAndDelete({ userId });
        return res.status(200).json("order placed successfully");
    }

    if (state !== "delete") {
      // Recalculate the total cost of the cart and the cost with the discount
      let cartTotal = 0;
      let cartCount = 0;
      cart.products.forEach((item) => {
        const { price } = item.product;
        const quantity = item.quantity;

        cartTotal += price * quantity;
        cartCount += quantity;
      });

      // Update the values of the total cost of the cart and the cost with the discount
      cart.cartTotal = cartTotal;
      cart.totalAfterDiscount = 0;
      cart.count = cartCount;

      await cart.save();

      return res.status(200).json(cart);
    }
  } catch (err) {
    console.error("Error retrieving the cart:", err);
  }
};

const deleteItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id.toString();

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) return null;

    //  Find the index of the product in the cart by productId
    const productIndex = cart.products.findIndex(
      (item) => item.product.id.toString() === productId
    );

    if (productIndex === -1) {
      console.log("Product not found in the cart.");
      return;
    }

    // Remove the product from the products
    cart.products.splice(productIndex, 1);

    // Recalculate the total cost of the cart and the cost with the discount
    let cartTotal = 0;
    let cartCount = 0;
    cart.products.forEach((item) => {
      const { price } = item.product;
      const quantity = item.quantity;

      cartTotal += price * quantity;
      cartCount += quantity;
    });

    // Update the values of the total cost of the cart and the cost with the discount
    cart.cartTotal = cartTotal;
    cart.count = cartCount;

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error retrieving the cart:", err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res.status(401).json("Access Denied:Not authorized!");
    }

    const verifyRefreshToken = jsonwebtoken.verify(
      refreshToken,
      process.env.TOKEN_REFRESH_SECRET
    );
    const user = await userModel.findOne({ refreshToken });

    if (!verifyRefreshToken || !user)
      return res.status(401).json("Access Denied:Not authorized!");

    const tokens = tokenService.generateTokens({
      data: user.id,
    });

    user.refreshToken = tokens.refreshToken;

    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      ...user._doc,
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    console.error("Error refreshing access token:", err);
  }
};

const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const userId = req.user._id.toString();
  try {
    const validCoupon = await couponModel.findOne({ name: coupon });

    if (!validCoupon) return res.status(400).json("Coupon not found");

    if (
      validCoupon.expiry.toDateString() === new Date(Date.now()).toDateString()
    ) {
      return res.status(400).json("Coupon not valid");
    }

    let { cartTotal } = await cartModel.findOne({ userId });

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed();

    const cart = await cartModel.findOneAndUpdate(
      { userId: userId },
      { totalAfterDiscount },
      { new: true }
    );

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error apply Coupon code:", err);
  }
};

export default {
  signup,
  login,
  logout,
  getUser,
  forgotPasswordToken,
  resetPassword,
  setCart,
  getCart,
  updateCart,
  deleteItem,
  refreshToken,
  applyCoupon,
};
