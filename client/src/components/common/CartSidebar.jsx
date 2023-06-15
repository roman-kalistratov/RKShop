import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSidebar } from '../../redux/features/cartSidebarSlice';
import { Link } from 'react-router-dom';
import { removeProduct, setCart } from '../../redux/features/userSlice';
import { toast } from 'react-toastify';
import { vat } from '../../utils/vat';
import { totalWithVat } from '../../utils/totalWithVat';
import Loader from '../common/Loader';
import userApi from '../../api/modules/user.api';
import style from '../../styles/CartSidebar.module.scss';

const CartSidebar = () => {
    const { cartSidebar } = useSelector((state) => state.cartSidebar);
    const { cart } = useSelector((state) => state.user);
    const [query, setQuery] = useState(false);

    const sidebarRef = useRef();
    const sidebarContentRef = useRef();

    const dispatch = useDispatch();

    const removeProductFromCart = async (productId) => {
        setQuery(true)
        const response = await userApi.remove(productId);

        if (response) {
            setQuery(false);
            toast.success("Product successfully deleted.");
            dispatch(removeProduct(productId));
            if (response.products.length > 0) dispatch(setCart(response))
            else dispatch(setCart(null))
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleCloseSideBar);

        return () => {
            document.removeEventListener("click", handleCloseSideBar);
        };
    }, []);

    const handleCloseSideBar = (e) => {
        if (sidebarRef.current.contains(e.target) && !sidebarContentRef.current.contains(e.target)) {
            dispatch(setCartSidebar(false))
        }
    };


    return (
        <div className={`${style.cartSidebar} ${cartSidebar && style.cartSidebarActive}`} ref={sidebarRef}>
            <div className={`${style.wrapper} ${cartSidebar && style.wrapperActive}`} ref={sidebarContentRef}>
                <AiOutlineClose className={style.closeBtn} onClick={() => dispatch(setCartSidebar(false))} />
                {cart ? (<>
                    <ul className={style.list}>
                        {cart.products.map(item => (
                            <li key={item.product.id}>
                                <Link to={`/products/${item.product.id}`} onClick={() => dispatch(setCartSidebar(false))}>
                                    <div className={style.image}>
                                        <img src={item.product.image} alt="image_not_found" />
                                    </div>
                                    <div className={style.content}>
                                        <h4>{item.product.title}</h4>
                                        <span>${item.product.price}</span>
                                        <h4 className={style.quantity}>x {item.quantity}</h4>
                                    </div>
                                </Link>
                                <AiOutlineDelete className={style.removeBtn} onClick={() => removeProductFromCart(item.product.id)} />
                            </li>
                        ))}

                        {query && <Loader />}
                    </ul>

                    <div className={style.total}>
                        <li>
                            <span>Subtotal:</span>
                            <span>${cart.cartTotal}</span>
                        </li>
                        <li>
                            <span>Vat 5%</span>
                            <span>${vat(cart.cartTotal)}</span>
                        </li>
                        <li>
                            <span>Total:</span>
                            <span>${totalWithVat(cart.cartTotal)}</span>
                        </li>
                    </div>

                    <div className={style.btns}>
                        <Link to="/cart" className='button additional small' onClick={() => dispatch(setCartSidebar(false))}>View Cart</Link>
                        <Link to="/checkout" className='button additional small' onClick={() => dispatch(setCartSidebar(false))}>Checkout</Link>
                    </div></>
                ) : (<p className={style.empty}>Cart is Empty</p>)}
            </div>
        </div>
    )
}

export default CartSidebar