import { useFormContext, Controller } from "react-hook-form";

function FTextField({
  name,
  label,
  className = "",
  type = "text",
  endAdornment,
  multiline,
  rows = 4,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`w-full ${className}`}>
          {label && (
            <label className="block font-medium text-black mb-2">{label}</label>
          )}
          <div className="relative">
            {multiline ? (
              <textarea
                rows={rows}
                className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black"
                }`}
                {...field}
                {...other}
              />
            ) : (
              <input
                type={type}
                className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black"
                } ${endAdornment ? "pr-12" : ""}`}
                {...field}
                {...other}
              />
            )}
            {endAdornment && !multiline && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {endAdornment}
              </div>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default FTextField;
