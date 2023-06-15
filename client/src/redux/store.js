import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import categoriesSlice from "./features/categoriesSlice";
import globalLoadingSlice from "./features/globalLoadingSlice";
import cartSidebarSlice from "./features/cartSidebarSlice";
import searchMobileSlice from "./features/searchMobileSlice";
import navSidebarSlice from "./features/navSidebarSlice";


const store = configureStore({
  reducer: {
    user: userSlice,
    categories: categoriesSlice,
    globalLoading: globalLoadingSlice,
    cartSidebar: cartSidebarSlice,
    navSidebar: navSidebarSlice,
    searchMobile: searchMobileSlice
  },
});

export default store;
