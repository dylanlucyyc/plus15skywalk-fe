import React from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../features/user/userSlice";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../form";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  avatar_url: Yup.string().url("Must be a valid URL"),
});

function EditProfileModal({ open, onClose, user }) {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      avatar_url: user?.avatar_url || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile({ userId: user._id, ...data }));
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <FiX size={24} />
            </button>
          </div>

          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FTextField name="name" label="Name" required />

              <FTextField
                name="avatar_url"
                label="Avatar URL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
