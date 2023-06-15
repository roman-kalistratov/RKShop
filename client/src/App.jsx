import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCategories } from "./redux/features/categoriesSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainLayout from "./components/layout/MainLayout";
import PageWrapper from "./components/common/PageWrapper";
import routes from "./routes/routes";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);


  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme={"light"}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {routes.map((route, index) => (
              route.index ? (
                <Route
                  index
                  key={index}
                  element={<PageWrapper>{route.element}</PageWrapper>}
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={<PageWrapper>{route.element}</PageWrapper>}
                />
              )
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  );
};

export default App;
