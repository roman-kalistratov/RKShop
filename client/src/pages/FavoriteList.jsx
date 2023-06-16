import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalLoading } from '../redux/features/globalLoadingSlice';
import { removeFavorite, setCart, setListFavorites } from '../redux/features/userSlice';
import { toast } from 'react-toastify';
import { FaHeart, FaRegEye } from 'react-icons/fa'
import { AiOutlineDelete } from 'react-icons/ai';
import Container from '../components/common/Container'
import ReactStars from "react-rating-stars-component";
import productApi from '../api/modules/product.api';
import favoriteApi from '../api/modules/favorite.api';
import styles from '../styles/FavoriteList.module.scss'
import Loader from '../components/common/Loader';

const FavoriteList = () => {
    const { user } = useSelector((state) => state.user);
    const [favoriteList, setFavoriteList] = useState([]);
    const [count, setCount] = useState(0);
    const [request, setRequest] = useState({ state: false, id: undefined });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getFavorites = async () => {
            dispatch(setGlobalLoading(true));
            const { response, err } = await favoriteApi.getList();
            dispatch(setGlobalLoading(false));

            if (response) {
                setFavoriteList(response.products);
                setCount(response.products.length)
            }
            if (err) toast.error(err);
        };

        getFavorites();
    }, [dispatch, count]);

    const handleRemove = async (productId) => {
        if (request.state) return;
        setRequest({ state: true, id: productId });

        const { response, err } = await favoriteApi.remove(productId);

        setRequest({ state: false, id: undefined });

        if (err) toast.error(err);
        if (response) {
            dispatch(removeFavorite(productId));
            dispatch(setListFavorites(response.products.length > 0 ? response : null));
            setFavoriteList(response.products)
            toast.success("Remove favorite success");
        }
    }

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

    return (
        <Container>
            <div className={styles.favoriteList}>
                {favoriteList.length > 0 ? (
                    <>
                        <div className={styles.header}>
                            <span>your best choice</span>
                            <h2>Favorites ({count})</h2>
                        </div>
                        <div className={styles.wrapper}>
                            {favoriteList && favoriteList.map((product) => (
                                <div key={product.id} className={styles.item}>
                                    <div className={styles.heartIcon}>
                                        {request.state && request.id === product.id ? (
                                            <Loader />
                                        ) : (
                                            <FaHeart />
                                        )}
                                    </div>
                                    <Link to={`/products/${product.id}`}>
                                        <img src={product.thumbnail} alt="product_image" />
                                    </Link>

                                    <div className={styles.details}>
                                        <div className={styles.top}>
                                            <h6>{product.category}</h6>
                                            <Link to={`/products/${product.id}`}><FaRegEye /></Link>
                                            <AiOutlineDelete onClick={() => handleRemove(product.id)} />
                                        </div>
                                        <h5>{product.title}</h5>
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={product.rating}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <p className={styles.description}>
                                            {product.description}
                                        </p>
                                        <div className={styles.footer}>
                                            <p className={styles.price}>
                                                <strong>${product.price}</strong>
                                            </p>
                                            <span onClick={() => handleAddToCart(product)}>Add to cart</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (<p>Wishlist is Empty <Link to="/">Go Back</Link></p>)}
            </div>
        </Container>
    )
}

export default FavoriteList