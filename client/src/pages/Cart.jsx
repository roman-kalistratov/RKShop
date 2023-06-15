import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineDelete } from 'react-icons/ai';

import { removeProduct, setCart } from '../redux/features/userSlice';
import userApi from '../api/modules/user.api';

import { vat } from '../utils/vat';
import { totalWithVat } from '../utils/totalWithVat';

import Loader from '../components/common/Loader';
import Container from '../components/common/Container';
import styles from '../styles/Cart.module.scss';
import productApi from '../api/modules/product.api';

const Cart = () => {
  const { cart } = useSelector((state) => state.user);
  const [query, setQuery] = useState({ state: false, id: null });

  const dispatch = useDispatch();

  const removeProductFromCart = async (productId) => {
    setQuery({ state: true, id: productId })
    const response = await userApi.remove(productId);

    if (response) {
      setQuery({ state: false, id: null })
      toast.success("Product successfully deleted.");
      dispatch(removeProduct(productId));
      dispatch(setCart(response.products.length > 0 ? response : null));
    }
  }

  const increaseQuantity = async (productId) => {
    setQuery({ state: true, id: productId })
    const { response, err } = await productApi.updateCart(productId, "increase");
    setQuery({ state: false, id: null })
    if (response) dispatch(setCart(response));
    if (err) console.log(err)
  };


  const decreaseQuantity = async (productId) => {
    setQuery({ state: true, id: productId })
    const { response, err } = await productApi.updateCart(productId, "decrease");
    setQuery({ state: false, id: null })
    if (response) dispatch(setCart(response));
    if (err) console.log(err)
  };


  return (
    <Container>
      <div className={styles.cart}>
        {cart ? (
          <>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className={styles.total}>Total</th>
                    <th>-</th>
                  </tr>
                </thead>

                <tbody>
                  {cart && cart.products.map((item, index) => (
                    <tr key={item.product.id}>
                      <td className={styles.product}>
                        <div className={styles.productItem}>
                          <Link to={`/products/${item.product.id}`} className={styles.thumb}>
                            <img src={item.product.image} alt="Product" />
                          </Link>
                          <Link to={`/products/${item.product.id}`} className={styles.name}>{item.product.title}</Link>
                        </div>
                      </td>
                      <td>
                        <span className={styles.price}>${item.product.price}</span>
                      </td>
                      <td className={styles.qty}>
                        <div className={styles.qty}>
                          <span onClick={() => increaseQuantity(item.product.id)}>+</span>
                          <input
                            type="text"
                            title="Quantity"
                            value={item.quantity}
                            readOnly
                          />
                          <span onClick={() => decreaseQuantity(item.product.id)}>-</span>
                        </div>
                      </td>
                      <td className={styles.total}>
                        <span className={styles.price}>${item.product.price * item.quantity}</span>
                      </td>
                      <td className={styles.delete}>
                        {query.state && query.id === item.product.id ? <Loader />
                          : <AiOutlineDelete onClick={() => removeProductFromCart(item.product.id)} />
                        }
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <div className={styles.calculateArea}>
              <div className={styles.content}>
                <h2>Cart Totals</h2>

                <div className={styles.calculateAreaTable}>
                  <table>
                    <thead>
                      <tr className={styles.bordered}>
                        <th>Subtotal</th>
                        <td>${cart.cartTotal}</td>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>

                    <tfoot>
                      <tr className={styles.bordered}>
                        <th>Vat 5%</th>
                        <td>${vat(cart.cartTotal)}</td>
                      </tr>
                      <tr className={styles.bordered}>
                        <th>Total</th>
                        <td><b>${totalWithVat(cart.cartTotal)}</b></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className={styles.btn}>
                  <Link to={"/checkout"} className="button primary">Proceed to Checkout</Link>
                </div>
              </div>
            </div>
          </>
        ) : (<p>Cart is Empty <Link to="/">Go Back</Link></p>)}
      </div>
    </Container>

  )
}

export default Cart