import { useFormContext, Controller } from "react-hook-form";

function FSelect({ name, label, children, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
          )}
          <select
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 appearance-none bg-white ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-black"
            }`}
            {...field}
            {...other}
          >
            {children}
          </select>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default FSelect;
