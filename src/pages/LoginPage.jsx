import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FTextField, FormProvider } from "../components/form";
import Button from "../components/Button";
import illustration from "../assets/images/Illustration.svg";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/user/me", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const from = location.state?.from?.pathname || "/";
    let { email, password } = data;

    try {
      await auth.login({ email, password }, () => {
        navigate(from, { replace: true });
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-between md:flex-row md:gap-20 min-h-screen container px-4 py-20 mx-auto my-auto">
      <div className="flex justify-center w-1/2">
        <img
          src={illustration}
          alt="Registration illustration"
          width="636"
          height="526"
          className="w-70vh h-auto"
        />
      </div>
      <FormProvider
        className="w-full lg:w-1/2 flex flex-col justify-center"
        onSubmit={handleSubmit(onSubmit)}
        methods={methods}
      >
        <h1 className="text-3xl font-black mb-8">Sign In</h1>
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
        <Button type="submit" className="mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
        {errors.responseError && (
          <p className="text-red-500 mt-2 text-center">
            {errors.responseError.message}
          </p>
        )}
        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="font-black">
            Sign Up
          </Link>
        </p>
      </FormProvider>
    </div>
  );
}

export default LoginPage;
