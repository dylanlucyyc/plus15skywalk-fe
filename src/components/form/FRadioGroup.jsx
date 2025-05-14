import { useFormContext, Controller } from "react-hook-form";

function FRadioGroup({ name, options, getOptionLabel, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <div className="flex flex-wrap gap-4" {...other}>
            {options.map((option, index) => (
              <label
                key={option}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  value={option}
                  checked={field.value === option}
                  onChange={() => field.onChange(option)}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {getOptionLabel?.length ? getOptionLabel[index] : option}
                </span>
              </label>
            ))}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default FRadioGroup;
