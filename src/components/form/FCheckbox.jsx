import { useFormContext, Controller } from "react-hook-form";

function FCheckbox({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-black border-gray-300 focus:ring-black"
            checked={field.value}
            {...field}
            {...other}
          />
          {label && <span className="ml-2 text-sm text-black">{label}</span>}
        </label>
      )}
    />
  );
}

export default FCheckbox;
