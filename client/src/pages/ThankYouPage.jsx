import React from 'react'
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import styles from '../styles/ThankYouPage.module.scss'

const ThankYouPage = () => {
    return (
        <Container>
            <div className={styles.thankYouPage}>
                <h1>Thank You!</h1>
                <p>Your order has been successfully placed.</p>
                <p>We appreciate your business and value you as our customer.</p>
                <p>If you have any questions regarding your order, please feel free to <Link to="/contact">contact us</Link>.</p>
                <p>Thank you again for choosing our shop!</p>

                <span>
                    <Link to="/" className='button primary'>Continue Shopping</Link>
                </span>
            </div>
        </Container>
    )
}

export default ThankYouPage