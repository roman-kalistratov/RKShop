import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegEye } from 'react-icons/fa'
import { discountPrice } from '../../utils/discountPrice';
import { addFavorite, removeFavorite, setCart, setListFavorites } from '../../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import productApi from '../../api/modules/product.api';
import ReactStars from "react-rating-stars-component";
import favoriteApi from '../../api/modules/favorite.api';
import favoriteUtils from '../../utils/favorite.utils';
import styles from '../../styles/ProductCard.module.scss';
import Loader from './Loader';

const ProductCard = ({ product, children }) => {
  const { user, listFavorites } = useSelector((state) => state.user);
  const [request, setRequest] = useState({ state: false, id: undefined });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFavorite = async () => {
    if (!user) return toast.error("You are not authorized");

    if (favoriteUtils.check({ listFavorites, productId: product.id })) {
      onRemoveFavorite(product.id);
      return;
    }

    if (request.state) return;
    setRequest({ state: true, id: product.id });

    const { response, err } = await favoriteApi.add({ product });

    setRequest({ state: false, id: undefined });

    if (response) {
      dispatch(addFavorite(response));
      toast.success("Add favorite success");
    }
    if (err) toast.error(err);
  }

  const onRemoveFavorite = async (productId) => {
    if (request.state) return;
    setRequest({ state: true, id: product.id });

    const { response, err } = await favoriteApi.remove(productId);

    setRequest({ state: false, id: undefined });

    if (err) toast.error(err);
    if (response) {
      dispatch(removeFavorite(productId));
      dispatch(setListFavorites(response.products.length > 0 ? response : null));
      toast.success("Remove favorite success");
    }
  };

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
        toast.success("Product added to cart.");
        dispatch(setCart(response))
      }
    }
  }

  return (
    <div className={styles.card}>
      {
        request.state && request.id === product.id
        && <div className={styles.loader}><Loader /></div>
      }

      <Link to={`/products/${product.id}`}>
        <div className={styles.image}>
          <img src={product.images[1] || product.thumbnail} alt="product__image" />
          <img src={product.images[0] || product.thumbnail} alt="product__image" />
        </div>
      </Link>
      
      <div className={styles.details}>
        <div className={styles.header}>
          <h6>{product.category}</h6>
          <Link to={`/products/${product.id}`}><FaRegEye /></Link>

          {favoriteUtils.check({ listFavorites, productId: product.id }) ?
            <FaHeart onClick={handleFavorite} />
            : <FaRegHeart onClick={handleFavorite} />}
        </div>
        <h5>{product.title}</h5>
        <ReactStars
          count={5}
          size={24}
          value={product.rating > 4.5 ? 5 : product.rating}
          edit={false}
          activeColor="#ffd700"
        />
        <p className={styles.description}>
          {product.description}
        </p>
        <p className={styles.description}>
          Brand: <b>{product.brand}</b>
        </p>
        <div className={styles.footer}>
          <p className={styles.price}>
            <strong>${product.price}</strong>
            <del>${discountPrice(product.price, product.discountPercentage)}</del>
          </p>
          <span onClick={() => handleAddToCart(product)}>Add to cart</span>
        </div>
      </div>
      {children}
    </div>
  )
}

export default ProductCard;