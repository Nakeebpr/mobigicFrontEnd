import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/apiServices";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const inputRef = useRef();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const showPassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const showPassword2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      email: Yup.string()
        .required("Please Enter Email")
        .email("Please Enter Valid Email"),
      password: Yup.string()
        .required("Please Enter Password")
        .min(6, "Password Must Be Of 6 Characters")
        .max(6, "Password Must Be Of 6 Characters"),
      cpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords Must Match")
        .required("Confirm Password Is Required"),
    }),

    onSubmit: async (values) => {
      try {
        const data = {
          name: values.name,
          email: values.email,
          password: values.password,
        };

        try {
          setIsLoading(true);
          const response = await post("/register", data);

          if (response?.data?.status) {
            localStorage.setItem("token", response?.data?.token);
            localStorage.setItem("role", response?.data?.Role);
            navigation("/");
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="login-page">
      <div className="justify-content-center row login_width">
        <div className="col-12 col-md-12 col-sm-12">
          <div className="overflow-hidden card login-shadow p-5">
            <div className="pt-0" style={{ padding: "0px 30px" }}>
              <div className="form-info">
                <form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <div className="mb-3">
                    <lable className="form-label">Name</lable>
                    <input
                      name="name"
                      className="form-control lable-margin inputFocus textColor"
                      placeholder="Please Enter The Name"
                      type="text"
                      ref={inputRef}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.name || ""}
                      invalid={
                        validation.touched.name && validation.errors.name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.name && validation.errors.name ? (
                      <div type="invalid" className="error">
                        {validation.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <lable className="form-label">Email</lable>
                    <input
                      name="email"
                      className="form-control lable-margin inputFocus textColor"
                      placeholder="Please Enter The Email"
                      type="email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={
                        validation.touched.email && validation.errors.email
                          ? true
                          : false
                      }
                    />
                    {validation.touched.email && validation.errors.email ? (
                      <div type="invalid" className="error">
                        {validation.errors.email}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <lable className="form-label">Password</lable>
                    <div style={{ position: "relative" }}>
                      <input
                        name="password"
                        value={validation.values.password || ""}
                        className="form-control lable-margin inputFocus textColor"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Please Enter The Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                      />
                      <div className="eye-icon" onClick={showPassword}>
                        {passwordVisible ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="20"
                            viewBox="0 0 640 512"
                          >
                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="18"
                            viewBox="0 0 576 512"
                          >
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {validation.touched.password &&
                    validation.errors.password ? (
                      <div type="invalid" className="error">
                        {validation.errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <lable className="form-label">Confirm Password</lable>
                    <div style={{ position: "relative" }}>
                      <input
                        name="cpassword"
                        value={validation.values.cpassword || ""}
                        className="form-control lable-margin inputFocus textColor"
                        type={passwordVisible2 ? "text" : "password"}
                        placeholder="Please Enter The Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.cpassword &&
                          validation.errors.cpassword
                            ? true
                            : false
                        }
                      />
                      <div className="eye-icon" onClick={showPassword2}>
                        {passwordVisible2 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="20"
                            viewBox="0 0 640 512"
                          >
                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="18"
                            viewBox="0 0 576 512"
                          >
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {validation.touched.cpassword &&
                    validation.errors.cpassword ? (
                      <div type="invalid" className="error">
                        {validation.errors.cpassword}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-block button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>
                <div className="text-center my-2">
                  Already registered...
                  <Link to="/login">Go to login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
