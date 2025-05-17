import React from "react";
import Button from "../../components/Button";
import Illustration from "../../assets/images/Illustration.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../../components/form";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubscriber } from "./subscribeSlice";
import { useEffect } from "react";

const SubscribeSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const defaultValues = {
  email: "",
};

function Subscribe() {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(SubscribeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  const { error } = useSelector((state) => state.subscribe);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    dispatch(createSubscriber(data));
    reset();
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      setError("responseError", {
        type: "manual",
        message: error?.message || "Subscription failed",
      });
    }
  }, [error, setError]);

  return (
    <div
      id="subscribe"
      className="flex flex-col px-4 md:flex-row container mx-auto justify-between items-center gap-6 py-12"
    >
      <img src={Illustration} alt="" className="w-full md:w-1/2" />
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-1/2 flex flex-col gap-4"
      >
        <h2 className="text-6xl font-bold">Join Our Newsletter</h2>
        <div className="flex gap-4">
          <FTextField
            name="email"
            placeholder="Enter your email"
            onClick={() => clearErrors("responseError")}
          />
          <Button type="submit">
            {" "}
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
        {errors.responseError && (
          <p className="text-red-500 mt-2">
            {typeof error === "string" ? error : error?.message}
          </p>
        )}
      </FormProvider>
    </div>
  );
}

export default React.memo(Subscribe);
