import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import favoriteController from "../controllers/favorite.controller.js";

const router = express.Router();
//user auth
router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("username minimum 3 characters"),
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Not a proper email")
    .custom(async (value) => {
      const user = await userModel.findOne({ email: value });
      if (user) return Promise.reject("email already exists");
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 3 })
    .withMessage("password minimum 3 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 3 })
    .withMessage("confirmPassword minimum 3 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  userController.signup
);

router.post(
  "/login",
  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Not a proper email"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 3 })
    .withMessage("password minimum 3 characters"),
  userController.login
);

//user auth
router.get("/auth", tokenMiddleware.auth, userController.getUser);
router.post("/forgot-password", userController.forgotPasswordToken);
router.post("/logout", userController.logout);
router.get("/refresh-token", userController.refreshToken);
router.post("/reset-password/:token", userController.resetPassword);

//user cart
router.post("/cart", tokenMiddleware.auth, userController.setCart);
router.post("/cart/applycoupon", tokenMiddleware.auth, userController.applyCoupon);
router.get("/cart/:userId", userController.getCart);
router.put("/cart", tokenMiddleware.auth, userController.updateCart);
router.delete("/cart/:productId",tokenMiddleware.auth,userController.deleteItem);

//user favorites
router.post("/favorites",tokenMiddleware.auth, favoriteController.addFavorite);
router.get("/favorites",tokenMiddleware.auth,favoriteController.getFavoritesOfUser);
router.delete("/favorites/:productId",tokenMiddleware.auth,favoriteController.removeFavorite);

export default router;
