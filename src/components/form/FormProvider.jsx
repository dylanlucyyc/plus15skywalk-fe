import { FormProvider as RHFormProvider } from "react-hook-form";

function FormProvider({ children, onSubmit, methods, className }) {
  return (
    <RHFormProvider {...methods}>
      <form className={className} onSubmit={onSubmit}>
        {children}
      </form>
    </RHFormProvider>
  );
}

export default FormProvider;
