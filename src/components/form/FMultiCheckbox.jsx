import { useFormContext, Controller } from "react-hook-form";

function FMultiCheckbox({ name, options, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onSelected = (option) =>
          field.value.includes(option)
            ? field.value.filter((value) => value !== option)
            : [...field.value, option];

        return (
          <div className="w-full">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
            )}
            <div className="space-y-2">
              {options.map((option) => (
                <label
                  key={option}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    checked={field.value.includes(option)}
                    onChange={() => field.onChange(onSelected(option))}
                    {...other}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default FMultiCheckbox;
