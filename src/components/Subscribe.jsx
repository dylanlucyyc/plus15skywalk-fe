import React from "react";
import Button from "./Button";
import Illustration from "../assets/images/Illustration.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../components/form";
import { useForm } from "react-hook-form";

const SubscribeSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const defaultValues = {
  email: "",
};

function Subscribe() {
  const methods = useForm({
    resolver: yupResolver(SubscribeSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setError } = methods;

  const onSubmit = async (data) => {
    try {
      // Implement your subscription logic here
      console.log("Subscribing email:", data.email);
      // await subscribeToNewsletter(data.email);
      reset();
    } catch (error) {
      setError("responseError", error);
    }
  };

  return (
    <div className="flex flex-col px-4 md:flex-row container mx-auto justify-between items-center gap-6 py-12">
      <img src={Illustration} alt="" className="w-full md:w-1/2" />
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-1/2 flex flex-col gap-4"
      >
        <h2 className="text-6xl font-bold">Join Our Newsletter</h2>
        <div className="flex gap-4">
          <FTextField name="email" placeholder="Enter your email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </FormProvider>
    </div>
  );
}

export default Subscribe;
