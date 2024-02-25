import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";
import { Link } from 'react-router-dom';
import Container from './Container';
import styles from '../../styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <div className={styles.top}>
        <Container>
          <div className={styles.newsletter}>
            <div className={styles.top__data}>
              <img src='/img/newsletter.png' alt="newsletter" />
              <h2>Sign Up for Newsletter</h2>
            </div>

            <div className={styles.input__group}>
              <input
                type="text"
                className="form-control"
                placeholder="Your Email Address"
                aria-label="Your Email Address"
                aria-describedby="basic-addon2"
              />
              <span>Subscribe</span>
            </div>
          </div>
        </Container>
      </div>


      <div className={styles.info}>
        <Container>
          <div className={styles.info__wrapper}>
            <div className={styles.box}>
              <h4>Contact Us</h4>
              <address>
                Hno : 123 street, <br /> Israel, Akko <br />
                PinCode: 123456
              </address>
              <a href="tel:+972 123456789">+972 123456789</a>
              <a href="mailto:test@gmail.com">email@gmail.com</a>

              <div className={styles.social_icons}>
                <a href="https://www.linkedin.com/">
                  <BsLinkedin />
                </a>
                <a href="https://www.instagram.com/">
                  <BsInstagram />
                </a>
                <a href="https://www.github.com/">
                  <BsGithub />
                </a>
                <a href="https://www.youtube.com/">
                  <BsYoutube />
                </a>
              </div>
            </div>
            <div className={styles.box}>
              <h4>Information</h4>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/shipping-policy">Shipping Policy</Link>
              <Link to="/term-conditions">Terms & Conditions</Link>
            </div>

            <div className={styles.box}>
              <h4>Account</h4>
              <Link to="/faq">Faq</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/account">My Account</Link>
            </div>

            <div className={styles.box}>
              <h4>Quick Links</h4>
              <Link to="/privacy-policy">Laptops</Link>
              <Link to="/refund-policy">Headphones</Link>
              <Link to="/shipping-policy">Tablets</Link>
              <Link to="/term-conditions">Watch</Link>
            </div>
          </div>
        </Container>
      </div>

      <div className={styles.copyright}>
        Designed & Built by
        <Link to="https://www.romank.co.il/" target="_blank">
          <img src='/img/logo_footer.png' alt="logo-rk" />
        </Link>     
      </div>
    </footer>
  )
}

export default Footer