import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { SlUser } from 'react-icons/sl'
import { BsSearch } from 'react-icons/bs'
import { IoCartOutline } from 'react-icons/io5'
import { IoIosMenu } from 'react-icons/io';
import { RiLogoutCircleRLine, RiSettings2Line } from 'react-icons/ri'

import { setCartSidebar } from '../../redux/features/cartSidebarSlice';
import { setCart, setUser } from '../../redux/features/userSlice';
import userApi from '../../api/modules/user.api';
import productApi from '../../api/modules/product.api';

import Logo from './Logo';
import Container from './Container';
import styles from "../../styles/Header.module.scss";
import Loader from './Loader';
import { setSearchMobile } from '../../redux/features/searchMobileSlice';
import { setNavSidebar } from '../../redux/features/navSidebarSlice';

const Header = () => {
  const { user, cart, listFavorites } = useSelector((state) => state.user);
  const { searchMobile } = useSelector((state) => state.searchMobile);

  const [products, setProducts] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const [onSearchLoader, setOnSearchLoader] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [request, setRequest] = useState({ state: false, id: undefined });
  const [query, setQuery] = useState('');

  const searchArea = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async (e) => {
    try {
      const response = await userApi.logout();
      toast.success(response);

      dispatch(setUser(null));
      navigate("/");
    } catch (err) {
      toast.error("logout error:", err);
    }
  }

  const search = useCallback(
    async () => {
      // monitors the search to keep the window open
      setOnSearch(true);
      // search loader
      setOnSearchLoader(true)

      const { response, err } = await productApi.search({ query });

      console.log(response)

      setOnSearchLoader(false)

      if (response) {
        setTotalProducts(response.total)
        setProducts(response.products)
      }
      if (err) toast.error(err.message);
    },
    [query],
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      setProducts([]);
      setTotalProducts(0);
      setOnSearch(false);
    } else search();
  }, [search, query]);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("You are not authorized");
      navigate('/login');
    } else {
      if (request.state) return;
      setRequest({ state: true, id: product.id });

      const cartItem = {
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          image: product.thumbnail
        }
      }

      const response = await productApi.addToCart(cartItem);

      setRequest({ state: false, id: undefined });

      if (response) {
        toast.success("Product added successfuly.");
        dispatch(setCart(response))
      }
    }
  }

  const handleClick = () => {
    setProducts([]);
    setTotalProducts(0);
    setOnSearch(false);
    setQuery('');
  }

  const onClose = () => {
    setOnSearch(false);
    setQuery('');
  }

  useEffect(() => {
    document.addEventListener("click", handleCloseSideBar);

    return () => {
      document.removeEventListener("click", handleCloseSideBar);
    };
  }, []);

  const handleCloseSideBar = (e) => {
    if (searchArea.current && !searchArea.current.contains(e.target)) {
      onClose();
    }
  };


  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Container>
          <div className={styles.wrapper}>
            <p>Welcome to RK SHOP Online marketplace Store</p>
            <p>
              Hotline:
              <a href="tel:+972 123456789">+972 123456789</a>
            </p>
          </div>
        </Container>
      </div>

      <div className={`${styles.wrapper} container`}>
        <Logo />
        <div className={styles.hamburger}>
          <BsSearch onClick={() => dispatch(setSearchMobile(!searchMobile))} />
          <IoIosMenu onClick={() => dispatch(setNavSidebar(true))}/>
        </div>
        <div className={`${styles.input} ${searchMobile && styles.active}`}>
          <input
            type="search"
            name="search"
            placeholder="Please enter a product name..."
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />

          {onSearch && (
            <div className={styles.searchArea} ref={searchArea}>
              <>
                <div className={styles.close} onClick={onClose}>x</div>
                {!onSearchLoader ? (
                  <>
                    {products.map((product) => (
                      <div key={product.id} className={styles.searchItem}>
                        <Link to={`/products/${product.id}`} onClick={handleClick}>
                          <img src={product.thumbnail} alt="product" />
                        </Link>
                        <div className={styles.details}>
                          <Link to={`/products/${product.id}`} onClick={handleClick}>
                            <p><b>{product.title}</b></p>
                          </Link>
                          <Link to={`/products/${product.id}`} onClick={handleClick}>
                            <p>{product.brand}</p>
                          </Link>
                        </div>
                        <p className={styles.price}><b>${product.price}</b></p>
                        {request.state && request.id === product.id ? (
                          <div className={styles.loader}><Loader /></div>
                        ) : (
                          <button title="Add to card" onClick={() => handleAddToCart(product)} className='button additional small'>
                            <IoCartOutline />
                          </button>
                        )}
                      </div>
                    ))}
                    {totalProducts === 0 && <p>Products not found</p>}
                  </>
                ) : (
                  <>
                    <Loader />
                  </>
                )}
              </>
            </div>
          )}
          <span><BsSearch /></span>
        </div>

        <div className={styles.account}>
          {!user ? (
            <Link to='/login' className={styles.myAccount}>
              <SlUser/>
              <p>Log in <br /> My Account</p>
            </Link>
          ) : (
            <div className={styles.myAccount}>
              <SlUser/>
              <div className={`${styles.dropDown}`}>
                <p>Hi <span>{user.role}</span></p>
                <ul className={styles.dropDowMenu}>
                  <li><Link to="/"><SlUser />Profile</Link></li>
                  <li><Link to="/"><RiSettings2Line />Settings</Link></li>
                  <li onClick={handleLogOut}><RiLogoutCircleRLine />Logout</li>
                </ul>
              </div>
            </div>
          )}

          <Link to='/favorites' className={styles.favourites}>
            {listFavorites ?
              <FaHeart />
              : <FaRegHeart />}
            <p>Favourite <br /> wishlist</p>
          </Link>

          <div className={styles.cart} onClick={() => dispatch(setCartSidebar(true))}>
            <IoCartOutline />
            <div className={styles.badge}>
              {cart && <span>{cart.count}</span>}
              {cart && <p>$ {cart.cartTotal}</p>}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header