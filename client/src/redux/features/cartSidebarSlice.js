import { createSlice } from "@reduxjs/toolkit";

export const cartSidebar = createSlice({
  name: "CartSidebar",
  initialState: {
    cartSidebar: false
  },
  reducers: {
    setCartSidebar: (state, action) => {
      state.cartSidebar = action.payload;
    }
  }
});

export const {
    setCartSidebar
} = cartSidebar.actions;

export default cartSidebar.reducer;