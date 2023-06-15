import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Thumbs } from "swiper";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";
import Container from '../components/common/Container'
import Loader from "../components/common/Loader";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { addFavorite, setCart } from "../redux/features/userSlice";

import productApi from "../api/modules/product.api";
import favoriteApi from "../api/modules/favorite.api";
import reviewApi from "../api/modules/review.api";

import styles from '../styles/SingleProduct.module.scss';
import { setQueryCategory } from "../redux/features/categoriesSlice";

const offset = 0;
const limit = 5;

const SingleProduct = () => {
  const { user } = useSelector((state) => state.user);
  const { productId } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState({ state: false, id: undefined });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await productApi.getProduct(productId)
      dispatch(setGlobalLoading(false));
      if (response) setProduct(response);
      if (err) toast.error(err)
    };

    getProduct();
  }, [productId]);

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getList({ offset, limit });

      if (response) setReviews(response.comments);
      if (err) toast.error(err);
    };
    getReviews();
  }, [dispatch]);



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

      const response = await productApi.addToCart(cartItem, quantity);

      setRequest({ state: false, id: undefined });

      if (response) {
        toast.success("Product add to the cart success.");
        dispatch(setCart(response))
        setQuantity(1);
      }
    }
  }

  const handleAddToFavorite = async () => {
    if (!user) return toast.error("You are not authorized");

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

  return (
    <Container>
      {product && (
        <>
          <div className={styles.product}>
            {/* thumbArea */}
            <div className={styles.thumbArea}>
              <Swiper
                style={{
                  ".swiper": "#fff",
                }}
                spaceBetween={10}
                loop={true}
                pagination={{
                  clickable: true
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs, Pagination]}
                className={styles.mySwiper2}
                breakpoints={{
                  768: {
                    pagination: true
                  }
                }}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt="product" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className={styles.mySwiper}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt="product" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* thumbArea */}

            {/* details */}
            <div className={styles.details}>
              {
                request.state && request.id === product.id
                && <div className={styles.loader}><Loader /></div>
              }
              <div className={styles.detailsTop}>
                <ReactStars
                  classNames={styles.star}
                  count={5}
                  size={24}
                  value={product.rating}
                  edit={false}
                  activeColor="#ffd700"
                />
                <span>{reviews.length} rewiews</span>
              </div>

              <h1>{product.title}</h1>
              <p className={styles.price}><b>Price:<span>${product.price}</span></b></p>
              <div className={styles.bottom}>
                <p>{product.description}</p>
                <p><b>Brand:</b>{product.brand}</p>
                <p><b>Category:</b><Link to={`/store`} onClick={() => dispatch(setQueryCategory(product.category))}>{product.category}</Link></p>
                <p><b>Availablity:</b>In Stock</p>
              </div>

              <div className={styles.action}>
                <div className={styles.qty}>
                  <span onClick={() => setQuantity(quantity + 1)}>+</span>
                  <input type="text" title="Quantity" value={quantity} readOnly />
                  <span onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</span>
                </div>
                <div className={styles.btns}>
                  <button className="button primary small" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  <button className="button secondary small" onClick={() => handleAddToFavorite(product)}>Add to Wishlist</button>
                </div>
              </div>

              <div className={styles.shipping}>
                <h3>Shipping & Returns :</h3>
                <p>
                  Free shipping and returns available on all orders! <br /> We
                  ship all US domestic orders within
                  <b> 5-10 business days!</b>
                </p>
              </div>
            </div>
          </div>
          {/* details */}

          {/* reviews */}
          <div className={styles.reviewsArea}>
            <div className={styles.header}>
              <h2>Reviews</h2>
            </div>
            <div className={styles.reviews}>
              {
                reviews && reviews.map((item) => (
                  <div key={item.id} className={styles.reviewItem}>
                    <div className={styles.reviewItemTop}>
                      <h4>{item.user.username}</h4>
                      <ReactStars
                        count={5}
                        size={24}
                        value={5}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p>
                      {item.body}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
          {/* reviews */}
        </>
      )}
    </Container>)
}

export default SingleProduct