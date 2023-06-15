import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "../components/common/Divider";
import Loader from "../components/common/Loader";
import style from '../styles/Form.module.scss';
import userApi from "../api/modules/user.api";

const ResetPassword = () => {
    const { token } = useParams();
    const [isSigninRequest, setIsSigninRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const resetPasswordForm = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(3, "password minimum 3 characters")
                .required("password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "confirmPassword not match")
                .min(3, "confirmPassword minimum 3 characters")
                .required("confirmPassword is required")
        }),
        onSubmit: async values => {
            setIsSigninRequest(true);

            const { response, err } = await userApi.resetPassword(values, token);

            if (response) {
                navigate('/login')
                toast.success("Reset password success");
            }
            if (err) setErrorMessage(err);

            setIsSigninRequest(false)
            resetPasswordForm.resetForm();
        },
    });

    return (
        <div className={style.auth__card}>
            <h3>Reset Password</h3>
            <Divider />
            <form onSubmit={resetPasswordForm.handleSubmit}>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={resetPasswordForm.values.password}
                    onChange={resetPasswordForm.handleChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={resetPasswordForm.values.confirmPassword}
                    onChange={resetPasswordForm.handleChange}
                />

                <p className={style.error}>{
                    (resetPasswordForm.touched.password && resetPasswordForm.errors.password) ||
                    (resetPasswordForm.touched.confirmPassword && resetPasswordForm.errors.confirmPassword) ||
                    errorMessage}
                </p>

                {isSigninRequest && <Loader />}

                <div className={style.btns}>
                    <Divider />
                    <div>
                        <button className="button primary" type="submit">
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;

