import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.scss";

const Logo = () => {

  return (
    <Link to="/" className={styles.logo} >
      RK<span>SHOP</span>
    </Link>
  );
};

export default Logo;