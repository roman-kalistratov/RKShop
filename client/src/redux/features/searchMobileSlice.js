import { createSlice } from "@reduxjs/toolkit";

export const searchMobile = createSlice({
  name: "SearchMobile",
  initialState: {
    searchMobile: false
  },
  reducers: {
    setSearchMobile: (state, action) => {
      state.searchMobile = action.payload;
    }
  }
});

export const {
    setSearchMobile
} = searchMobile.actions;

export default searchMobile.reducer;