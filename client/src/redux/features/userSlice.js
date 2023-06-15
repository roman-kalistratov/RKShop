import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    cart: null,
    listFavorites: null,
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("accessToken");
      } else {
        if (action.payload.token)
          localStorage.setItem("accessToken", action.payload.token);
      }

      state.user = action.payload;
    },
    removeProduct: (state, action) => {
      const productId = action.payload;

      state.cart.products = state.cart.products.filter(
        (item) => item.product.id !== productId
      );

      if (state.cart.products.length === 0) state.cart = null;
    },
    setCart: (state, action) => {
      if (state.cart === null) state.cart = null;
      state.cart = action.payload;
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.listFavorites = action.payload;
    },
    removeFavorite: (state, action) => {
      const productId = action.payload;
      state.listFavorites.products = state.listFavorites.products.filter(
        (item) => item.id !== productId
      );

      if (state.listFavorites.products.length === 0) state.cart = null;
    },
  },
});

export const {
  setUser,
  addToCart,
  setCart,
  removeProduct,
  setListFavorites,
  addFavorite,
  removeFavorite,
} = userSlice.actions;

export default userSlice.reducer;
