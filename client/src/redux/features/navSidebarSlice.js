import { createSlice } from "@reduxjs/toolkit";

export const navSidebar = createSlice({
  name: "NavSidebar",
  initialState: {
    navSidebar: false
  },
  reducers: {
    setNavSidebar: (state, action) => {
      state.navSidebar = action.payload;
    }
  }
});

export const {
    setNavSidebar
} = navSidebar.actions;

export default navSidebar.reducer;