import React, { useState } from 'react'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Loader from '../components/common/Loader';
import Container from '../components/common/Container'

import { setCart } from '../redux/features/userSlice';
import { totalWithVat } from '../utils/totalWithVat';
import { vat } from '../utils/vat';

import productApi from '../api/modules/product.api';
import userApi from '../api/modules/user.api';
import styles from '../styles/Checkout.module.scss'

const Checkout = () => {
    const { cart } = useSelector((state) => state.user);
    const [isShipToDifferentAddress, setIsShipToDifferentAddress] = useState(false);
    const [shipping, setShipping] = useState("free");
    const [payment, setPayment] = useState("check");
    const [isCoupon, setIsCoupon] = useState(false);
    const [coupon, setCoupon] = useState(null);
    const [request, setRequest] = useState(false);
    const [query, setQuery] = useState({ state: false, id: null });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const billingForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            postcode: '',
            differentStreet: '',
            differentCity: '',
            differentState: '',
            differentPostcode: '',
            differentAddress: isShipToDifferentAddress
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .min(3, "firstName must be more than 3 characters")
                .required("firstName is required"),
            email: Yup.string().email('Not a proper email').required("email is required"),
            street: Yup.string().required("street is required"),
            city: Yup.string().required("city is required"),
            postcode: Yup.string().required("postcode is required"),
            differentStreet: isShipToDifferentAddress && Yup.string().required("street is required"),
            differentCity: isShipToDifferentAddress && Yup.string().required("city is required"),
            differentPostcode: isShipToDifferentAddress && Yup.string().required("postcode is required"),
        }),
        onSubmit: async values => {
            setRequest(true);
            const { response, err } = await productApi.updateCart("", "delete");
            setRequest(false);
            if (response) toast.success(response)
            if (err) console.log(err)
            dispatch(setCart(null))
            billingForm.resetForm();
            navigate('/thankyou')
        },
    });

    const handleShipping = (event) => {
        setShipping(event.target.value);
    };
    const handlePayment = (event) => {
        setPayment(event.target.value);
    };

    const handleAppleCoupon = async () => {
        if (coupon) {
            setQuery({ state: true, id: null })
            const { response, err } = await userApi.applyCoupon({ coupon });

            if (response) {
                setQuery({ state: false, id: null })
                dispatch(setCart(response))
                toast.success("Coupon code applied successfully");
            }

            if (err) {
                setQuery({ state: false, id: null })
                toast.error(err);
            }
        } else { toast.error("Coupon not found"); }
    }

    return (
        <Container>
            <div className={styles.checkout}>
                {/* coupon */}
                <div className={styles.coupon}>
                    {isCoupon && <span className={styles.close} onClick={() => setIsCoupon(false)}>x</span>}
                    <p>Have a coupon? <span onClick={() => setIsCoupon(!isCoupon)}>Click here to enter your code</span></p>

                    <div className={`${styles.collapse} ${isCoupon && styles.collapseActive}`}>
                        <input type="text" name="coupon" placeholder="Coupon Code" onChange={(e) => setCoupon(e.target.value)} />
                        <button type="button" className="button primary small" onClick={() => handleAppleCoupon()}>Apply coupon</button>
                        {query.state && isCoupon && <Loader />}
                        <p>To test, enter the coupon : coupon123</p>
                    </div>
                </div>
                {/* coupon */}

                <form onSubmit={billingForm.handleSubmit}>
                    <div className={styles.billing}>
                        <div className={styles.header}>
                            <h2>Billing Details</h2>
                        </div>
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="FirstName"
                                value={billingForm.values.firstName}
                                onChange={billingForm.handleChange}
                                className={`${billingForm.touched.firstName && billingForm.errors.firstName && styles.hasError}`}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="LastName"
                                value={billingForm.values.lastName}
                                onChange={billingForm.handleChange}
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={billingForm.values.email}
                            onChange={billingForm.handleChange}
                            className={`${billingForm.touched.email && billingForm.errors.email && styles.hasError}`}
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={billingForm.values.phone}
                            onChange={billingForm.handleChange}
                        />
                        <input
                            type="text"
                            name="street"
                            placeholder="Street address"
                            value={billingForm.values.street}
                            onChange={billingForm.handleChange}
                            className={`${billingForm.touched.street && billingForm.errors.street && styles.hasError}`}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Town / City"
                            value={billingForm.values.city}
                            onChange={billingForm.handleChange}
                            className={`${billingForm.touched.city && billingForm.errors.city && styles.hasError}`}
                        />

                        <div className={styles.formRow}>
                            <input
                                type="text"
                                name="state"
                                placeholder="State / Divition"
                                value={billingForm.values.state}
                                onChange={billingForm.handleChange}
                            />
                            <input
                                type="text"
                                name="postcode"
                                placeholder="Postcode / ZIP"
                                value={billingForm.values.postcode}
                                onChange={billingForm.handleChange}
                                className={`${billingForm.touched.postcode && billingForm.errors.postcode && styles.hasError}`}
                            />
                        </div>


                        <div className={styles.formCheck}>
                            <label htmlFor="ship_to_different">
                                <input type="checkbox" id="ship_to_different" name="ship" checked={isShipToDifferentAddress} onChange={() => setIsShipToDifferentAddress(!isShipToDifferentAddress)} />
                                Ship to a different address?
                            </label>
                        </div>

                        {isShipToDifferentAddress &&
                            <div className={styles.differentAddress}>
                                <input
                                    type="text"
                                    name="differentStreet"
                                    placeholder="Street address"
                                    value={billingForm.values.differentStreet}
                                    onChange={billingForm.handleChange}
                                    className={`${billingForm.touched.differentStreet && billingForm.errors.differentStreet && styles.hasError}`}

                                />
                                <input
                                    type="text"
                                    name="differentCity"
                                    placeholder="Town / City"
                                    value={billingForm.values.differentCity}
                                    onChange={billingForm.handleChange}
                                    className={`${billingForm.touched.differentCity && billingForm.errors.differentCity && styles.hasError}`}

                                />

                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        name="differentState"
                                        placeholder="State / Divition"
                                        value={billingForm.values.differentState}
                                        onChange={billingForm.handleChange}

                                    />
                                    <input
                                        type="text"
                                        name="differentPostcode"
                                        placeholder="Postcode / ZIP"
                                        value={billingForm.values.differentPostcode}
                                        onChange={billingForm.handleChange}
                                        className={`${billingForm.touched.differentPostcode && billingForm.errors.differentPostcode && styles.hasError}`}

                                    />
                                </div>
                            </div>
                        }
                    </div>


                    <div className={styles.order}>
                        <div className={styles.header}>
                            <h2>Your Order</h2>
                        </div>

                        <table>
                            {/* table thead */}
                            <thead>
                                <tr className={styles.bordered}>
                                    <th>Products</th>
                                    <td>Total</td>
                                </tr>
                            </thead>
                            {/* table thead */}

                            {/* table tbody */}
                            <tbody>
                                {cart && cart.products.map(item => (
                                    <tr key={item.product.id}>
                                        <th>{item.product.title} <span>x {item.quantity}</span></th>
                                        <td>${item.product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* table tbody */}

                            {/* table tfoot */}
                            <tfoot>
                                <tr className={styles.bordered}>
                                    <th>Subtotal</th>
                                    <td>${cart && cart.cartTotal}</td>
                                </tr>

                                {/* shipping method*/}
                                <tr className={styles.bordered}>
                                    <th>Shipping</th>
                                    <td>
                                        <ul className={styles.shipping}>
                                            {shippings.map((item, index) => (
                                                <li key={index}>
                                                    <div className={styles.check}>
                                                        <input
                                                            type="radio"
                                                            id={item.method}
                                                            name="shipping_method"
                                                            value={item.method}
                                                            checked={shipping === item.method}
                                                            onChange={(e) => handleShipping(e)}
                                                        />
                                                        <label htmlFor={item.method}>{item.text}</label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                                {/* shipping method*/}

                                {/* Coupon */}
                                <tr className={styles.bordered}>
                                    <th>Coupon discount 20%</th>
                                    <td>-${cart && (cart.cartTotal - cart.totalAfterDiscount)}</td>
                                </tr>
                                {/* Coupon */}

                                {/* total */}
                                {cart && cart.totalAfterDiscount > 0 ?
                                    (<>
                                        <tr>
                                            <th>Vat 5%</th>
                                            <td>${vat(cart && cart.cartTotal)}</td>
                                        </tr>
                                        <tr className={styles.bordered}>
                                            <th>Total</th>
                                            <td><b>${shipping === "flat" ? (cart && totalWithVat(cart.totalAfterDiscount) + 30) : (cart && totalWithVat(cart.totalAfterDiscount))}</b></td>
                                        </tr>
                                    </>
                                    ) : (
                                        <tr className={styles.bordered}>
                                            <th>Total</th>
                                            <td><b>${shipping === "flat" ? (cart && totalWithVat(cart.cartTotal) + 30) : (cart && totalWithVat(cart.cartTotal))}</b></td>
                                        </tr>
                                    )}
                                {/* total */}

                                {/* payment methods*/}
                                <tr className={styles.payment}>
                                    <th>Payment</th>
                                    <td>
                                        <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                        <ul className={styles.payment}>
                                            {payments.map((item, index) => (
                                                <li key={index}>
                                                    <div className={styles.check}>
                                                        <input
                                                            type="radio"
                                                            id={item.method}
                                                            name="payment_method"
                                                            value={item.method}
                                                            checked={payment === item.method}
                                                            onChange={(e) => handlePayment(e)}
                                                        />

                                                        <label htmlFor={item.method}>{item.text}</label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                                {/* payment methods*/}
                            </tfoot>
                            {/* table tfoot */}
                        </table>


                        {/* errors */}
                        <p className={styles.error}>{
                            (billingForm.touched.firstName && billingForm.errors.firstName) ||
                            (billingForm.touched.email && billingForm.errors.email) ||
                            (billingForm.touched.street && billingForm.errors.street) ||
                            (billingForm.touched.city && billingForm.errors.city) ||
                            (billingForm.touched.postcode && billingForm.errors.postcode) ||
                            (isShipToDifferentAddress && billingForm.touched.differentPostcode && billingForm.errors.differentPostcode) ||
                            (isShipToDifferentAddress && billingForm.touched.differentCity && billingForm.errors.differentCity) ||
                            (isShipToDifferentAddress && billingForm.touched.differentStreet && billingForm.errors.differentStreet)}
                        </p>
                        {/* errors */}
                        
                        {request ? <Loader /> :
                            <button className="button primary" type="submit">Place order</button>}
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Checkout

const shippings = [{
    method: "free",
    text: "Free Shipping"
}, {
    method: "local",
    text: "Local Pickup"
}, {
    method: "flat",
    text: "Flat Rate : $30"
}]

const payments = [{
    method: "check",
    text: "Check Payments"
}, {
    method: "cod",
    text: "Cash On Delivery"
}, {
    method: "paypal",
    text: "Paypal",
    img: "/img/payment.png"
}]