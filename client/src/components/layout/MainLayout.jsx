import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCart, setListFavorites, setUser } from '../../redux/features/userSlice'
import { toast } from 'react-toastify'

import Header from '../common/Header'
import Footer from '../common/Footer'
import Navbar from '../common/Navbar'
import GlobalLoading from '../common/GlobalLoading'
import ScrollUp from '../common/ScrollUp'
import CartSidebar from '../common/CartSidebar';

import userApi from '../../api/modules/user.api';
import favoriteApi from '../../api/modules/favorite.api'

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const authUser = async () => {

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const { response, err } = await userApi.auth(user)
        if (response) dispatch(setUser(response));
        if (err) dispatch(setUser(null));
      }
    };

    authUser();
  }, [dispatch]);

  useEffect(() => {
    const getCart = async () => {
      const { response } = await userApi.getCart(user._id);

      if (response) dispatch(setCart(response));
    };

    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (response) dispatch(setListFavorites(response));
      if (err) toast.error(err);
    };

    if (user) {
      getCart();
      getFavorites();
    }
    if (!user) {
      dispatch(setListFavorites(null));
      dispatch(setCart(null));
    }
  }, [dispatch, user]);


  return (
    <>
      {/* global loading */}
      <GlobalLoading />
      {/* global loading */}

      {/* scroll up */}
      <ScrollUp />
      {/* scroll up*/}

      {/* cart sidebar */}
      <CartSidebar />
      {/* cart sidebar */}

      <div className="header">
        <Header />
        <Navbar />
      </div>

      <div className="wrapper">
        <main className="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default MainLayout