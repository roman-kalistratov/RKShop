import * as Yup from "yup";
import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Divider from "../components/common/Divider";
import Loader from "../components/common/Loader";
import styles from '../styles/Form.module.scss';
import userApi from "../api/modules/user.api";

const Signup = () => {
  const [isSignupRequest, setIsSignupRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const signupForm = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "username must be more than 3 characters")
        .required("username is required"),
      email: Yup.string().email('Not a proper email'),
      password: Yup.string()
        .min(3, "password minimum 3 characters")
        .required("password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirmPassword not match")
        .min(3, "confirmPassword minimum 3 characters")
        .required("confirmPassword is required")
    }),
    onSubmit: async values => {
      setIsSignupRequest(true);

      const { response, err } = await userApi.signup(values);

      if (response) {
        navigate('/login')
        toast.success("Sign up success");
      }

      if (err) setErrorMessage(err);

      setIsSignupRequest(false)
      signupForm.resetForm();

    },
  });

  return (
    <div className={styles.auth__card}>
      <h3>Sign Up</h3>
      <Divider />
      <form onSubmit={signupForm.handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Name"
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          error={signupForm.errors.username}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupForm.values.email}
          onChange={signupForm.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
        />

        <p>
          By creating an account, you agree to our
          <Link to='/terms'>Terms</Link> and
          <Link to='/privacy-policy'>Privacy Policy</Link>
        </p>

        <p className={styles.error}>{
          (signupForm.touched.username && signupForm.errors.username) ||
          (signupForm.touched.email && signupForm.errors.email) ||
          (signupForm.touched.password && signupForm.errors.password) ||
          (signupForm.touched.confirmPassword && signupForm.errors.confirmPassword) ||
          errorMessage}
        </p>

        {isSignupRequest && <Loader />}
        <div className={styles.btns}>
          <Divider />
          <div>
            <button className="button primary" type="submit">
              SignUp
            </button>
            <Link to="/login" className="button secondary">
              Cancel
            </Link>
          </div>
        </div>


      </form>
    </div>
  );
};

export default Signup;
