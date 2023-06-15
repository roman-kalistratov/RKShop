import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu } from 'react-icons/io';
import { setQueryCategory } from "../../redux/features/categoriesSlice";
import Container from "./Container";
import styles from '../../styles/Navbar.module.scss';
import { setNavSidebar } from "../../redux/features/navSidebarSlice";
import { setUser } from "../../redux/features/userSlice";
import userApi from "../../api/modules/user.api";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isDropdown, setIsDropdown] = useState(false)
  const { list } = useSelector(({ categories }) => categories);
  const { navSidebar } = useSelector((state) => state.navSidebar);

  const sidebarRef = useRef();
  const sidebarContentRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigate = (category) => {
    dispatch(setNavSidebar(false));
    navigate("/store", { state: { category } });
    dispatch(setQueryCategory(category))
    setIsDropdown(false);
  }

  // for mobile sidebar
  useEffect(() => {
    document.addEventListener("click", handleCloseSideBar);

    return () => {
      document.removeEventListener("click", handleCloseSideBar);
    };
  }, []);


  const handleCloseSideBar = (e) => {
    if (sidebarRef.current.contains(e.target) && !sidebarContentRef.current.contains(e.target)) {
      dispatch(setNavSidebar(false))
    }
  };

  const handleLogOut = async (e) => {
    try {
      const response = await userApi.logout();
      toast.success(response);
      if (response) {
        dispatch(setUser(null));
        dispatch(setNavSidebar(false))
        navigate("/");
      }

    } catch (err) {
      toast.error("logout error:", err);
    }
  }

  return (
    <nav className={`${styles.navbar} ${navSidebar && styles.active}`} ref={sidebarRef}>
      <Container>
        <ul className={`${styles.navbar__list} ${navSidebar && styles.active}`} ref={sidebarContentRef}>
          <li className={styles.dropdown}>
            <button className={`${styles.dropdown__toggle} ${isDropdown && styles.dropdown__toggle__active}`} onClick={() => setIsDropdown(!isDropdown)}>
              <IoIosMenu />
              <span>Shop Categories</span>
            </button>
            <ul className={`${styles.dropdown__menu} ${isDropdown && styles.dropdown__menu__active}`}>
              {list.map((item, index) => (
                <li key={index} onClick={() => handleNavigate(item)}>{item}</li>
              ))}
            </ul>
          </li>

          {menu.map((item, index) => (
            <li key={index}><Link to={`/${item.link}`} onClick={() => dispatch(setNavSidebar(false))}>{item.name}</Link></li>
          ))}

          <li className={styles.logout} onClick={handleLogOut}>Logout</li>
        </ul>
      </Container>
    </nav>
  );
};

export default Navbar;

const menu = [{
  name: "home",
  link: ""
}, {
  name: "our store",
  link: "store"
}, {
  name: "about us",
  link: ""
}, {
  name: "contact",
  link: ""
}]