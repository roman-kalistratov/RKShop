import * as Yup from "yup";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import Divider from "../components/common/Divider";
import style from '../styles/Form.module.scss';
import userApi from "../api/modules/user.api";

const ForgotPassword = () => {
    const [isRequest, setIsRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const forgotPassword = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Not a proper email').required("email is required")
        }),
        onSubmit: async values => {
            setIsRequest(true);

            const { response, err } = await userApi.forgotPassword(values);

            if (response) {
                // navigate('/')
                toast.success(response);
            }
            if (err) {
                setErrorMessage(err);
            }
            setIsRequest(false)
            forgotPassword.resetForm();
        },
    });
    return (
        <div className={style.auth__card}>
            <h3>Reset Your Password</h3>
            <p className={style.text}>We will send you an email to reset your password</p>
            <Divider />
            <form onSubmit={forgotPassword.handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={forgotPassword.values.email}
                    onChange={forgotPassword.handleChange}
                />

                <p className={style.error}>{
                    (forgotPassword.touched.email && forgotPassword.errors.email) ||
                    errorMessage}
                </p>

                {isRequest && <Loader />}

                <div className={style.btns}>
                    <div>
                        <button className="button primary" type="submit">
                            Submit
                        </button>
                        <Link to="/login" className="button secondary">
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
