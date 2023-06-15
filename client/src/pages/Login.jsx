import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/features/userSlice";
import Divider from "../components/common/Divider";
import Loader from "../components/common/Loader";
import userApi from "../api/modules/user.api";
import style from '../styles/Form.module.scss'

const Login = () => {
  const [isRequest, setIsRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signinForm = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Not a proper email').required("email is required"),
      password: Yup.string()
        .min(3, "password minimum 3 characters")
        .required("password is required")
    }),
    onSubmit: async values => {
      setIsRequest(true);

      const { response, err } = await userApi.login(values);

      if (response) {
        dispatch(setUser(response));
        navigate('/')
        toast.success("Login success");
      }

      if (err) setErrorMessage(err);

      setIsRequest(false);
      signinForm.resetForm();
    },
  });

  return (
    <div className={style.auth__card}>
      <h3>Login</h3>
      <Divider />
      <form onSubmit={signinForm.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
        />

        <p className={style.error}>{
          (signinForm.touched.email && signinForm.errors.email) ||
          (signinForm.touched.password && signinForm.errors.password) ||
          errorMessage}
        </p>

        {isRequest && <Loader />}

        <div className={style.btns}>
          <Link to="/forgot-password" className={style.forgot_password}>Forgot Password?</Link>
          <Divider />
          <div>
            <button className="button primary" type="submit">
              Login
            </button>
            <Link to="/signup" className="button secondary">
              SignUp
            </Link>
          </div>
        </div>
        <div className={style.footer}>
          <p>For testing the capabilities of the project, you can log in as an:<br />
            <span>email:admin@gmail.com password:123</span><br />
            <span>email:user@gmail.com password:123</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

