import { useFormContext, Controller } from "react-hook-form";
import UploadSingleFile from "../UploadSingleFile";

function FUploadImage({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div className="w-full">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
            )}
            <UploadSingleFile
              accept="image/*"
              file={field.value}
              error={checkError}
              className={`w-full ${
                checkError ? "border-red-500" : "border-gray-300"
              }`}
              {...other}
            />
            {checkError && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export default FUploadImage;
