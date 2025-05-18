import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../components/form";
import Button from "../components/Button";
import illustration from "../assets/images/Illustration.svg";
import useAuth from "../hooks/useAuth";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/user/me", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    try {
      await auth.register({ name, email, password }, () => {
        navigate("/", { replace: true });
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-between md:flex-row md:gap-20 min-h-screen container px-4 py-20 mx-auto my-auto">
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2 flex flex-col justify-center"
      >
        <h1 className="text-3xl font-black mb-8">Create an Account</h1>
        <FTextField name="name" label="Full Name" className="mb-4" />
        <FTextField name="email" label="Email address" className="mb-4" />
        <FTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          className="mb-4"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />
        <FTextField
          name="passwordConfirmation"
          label="Password Confirmation"
          type={showPasswordConfirmation ? "text" : "password"}
          className="mb-4"
          endAdornment={
            <button
              type="button"
              onClick={() =>
                setShowPasswordConfirmation(!showPasswordConfirmation)
              }
              className="text-gray-500 hover:text-black"
            >
              {showPasswordConfirmation ? "Hide" : "Show"}
            </button>
          }
        />
        <Button type="submit" className="mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        {errors.responseError && (
          <p className="text-red-500 mt-2 text-center">
            {errors.responseError.message}
          </p>
        )}
        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="font-black">
            Sign In
          </Link>
        </p>
      </FormProvider>
      <div className="flex justify-center w-1/2">
        <img
          src={illustration}
          alt="Registration illustration"
          width="636"
          height="526"
          className="w-70vh h-auto"
        />
      </div>
    </div>
  );
}

export default RegisterPage;
