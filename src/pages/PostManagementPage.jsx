import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FTextField, FSelect, FormProvider, FEditor } from "../components/form";
import {
  createPost,
  updatePost,
  getPostById,
} from "../features/post/postSlice";
import useAuth from "../hooks/useAuth";

const postSchema = Yup.object().shape({
  post_type: Yup.string().required("Post type is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  image: Yup.string().url("Must be a valid URL"),
  tags: Yup.string(),
  slug: Yup.string()
    .required("Slug is required")
    .min(1, "Slug cannot be empty")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"
    ),
  event_details: Yup.object().when("post_type", {
    is: "events",
    then: () =>
      Yup.object().shape({
        date: Yup.date().required("Event date is required"),
        location: Yup.string().required("Location is required"),
        description: Yup.string().required("Description is required"),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
  restaurant_details: Yup.object().when("post_type", {
    is: "restaurants",
    then: () =>
      Yup.object().shape({
        longitude: Yup.number().required("Longitude is required"),
        latitude: Yup.number().required("Latitude is required"),
        address: Yup.string().required("Address is required"),
        opening_hours: Yup.string().required("Opening hours are required"),
        price_range: Yup.string().required("Price range is required"),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
});

const defaultValues = {
  post_type: "",
  title: "",
  content: "",
  image: "",
  tags: "",
  slug: "",
  event_details: {
    date: "",
    location: "",
    description: "",
  },
  restaurant_details: {
    longitude: "",
    latitude: "",
    address: "",
    opening_hours: "",
    price_range: "",
  },
};

function PostManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(postId);

  const { isAuthenticated, isInitialized } = useAuth();
  const { currentUser, error } = useSelector((state) => state.post);
  const isUserAuthenticated = isAuthenticated || !!currentUser;

  useEffect(() => {
    if (isInitialized && !isUserAuthenticated) {
      navigate("/signin", {
        state: {
          from: { pathname: postId ? `/post/edit/${postId}` : "/post/new" },
        },
      });
    }
  }, [isInitialized, isUserAuthenticated, navigate, postId]);

  const methods = useForm({
    resolver: yupResolver(postSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  const postType = watch("post_type");
  const title = watch("title");
  const _content = watch("content");

  useEffect(() => {
    if (error) {
      setError("responseError", {
        type: "manual",
        message: error || "Failed to save post",
      });
    }
  }, [error, setError]);

  useEffect(() => {
    if (postType === "restaurants" && !isEditMode) {
      const currentRestaurantDetails =
        methods.getValues("restaurant_details") || {};
      setValue("restaurant_details", {
        longitude: currentRestaurantDetails.longitude || "",
        latitude: currentRestaurantDetails.latitude || "",
        address: currentRestaurantDetails.address || "",
        opening_hours: currentRestaurantDetails.opening_hours || "",
        price_range: currentRestaurantDetails.price_range || "",
      });
    }
  }, [postType, isEditMode, setValue]);

  useEffect(() => {
    if (title && !isEditMode) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 100);
      setValue("slug", generatedSlug);
    }
  }, [title, setValue, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const { post } = await dispatch(getPostById(postId)).unwrap();
          const formattedPost = {
            ...post,
            tags: post?.tags || "",
            restaurant_details: {
              ...post?.restaurant_details,
              price_range: post?.restaurant_details?.price_range || "",
              longitude: post?.restaurant_details?.longitude || "",
              latitude: post?.restaurant_details?.latitude || "",
              address: post?.restaurant_details?.address || "",
              opening_hours: post?.restaurant_details?.opening_hours || "",
            },
            event_details: {
              ...post?.event_details,
              date: post?.event_details?.date
                ? new Date(post?.event_details?.date).toISOString().slice(0, 16)
                : "",
            },
          };
          reset(formattedPost);
        } catch (error) {
          console.error("Error fetching post:", error);
          navigate("/");
        }
      };
      fetchPost();
    }
  }, [postId, dispatch, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearErrors("responseError");

      if (!data.slug) {
        throw new Error("Slug is required");
      }

      if (data.event_details?.date) {
        const dateObj = new Date(data.event_details.date);
        if (!isNaN(dateObj.getTime())) {
          data.event_details.date = dateObj.toISOString();
        }
      }

      if (isEditMode) {
        await dispatch(updatePost({ postId, postData: data })).unwrap();
      } else {
        await dispatch(createPost(data)).unwrap();
      }

      navigate(`/${data.post_type}/${data.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("responseError", {
        type: "manual",
        message: error || "Failed to save post",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? "Edit Post" : "Create New Post"}
      </h1>

      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="max-w-4xl mx-auto space-y-6">
          <FSelect
            name="post_type"
            label="Post Type"
            required
            onClick={() => clearErrors("responseError")}
          >
            <option value="">Select a type</option>
            <option value="news">News</option>
            <option value="events">Events</option>
            <option value="restaurants">Restaurants</option>
          </FSelect>

          <FTextField
            name="title"
            label="Title"
            placeholder="Enter post title"
            required
            onClick={() => clearErrors("responseError")}
          />

          <FEditor
            name="content"
            label="Content"
            required
            onClick={() => clearErrors("responseError")}
          />

          <FTextField
            name="image"
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            onClick={() => clearErrors("responseError")}
          />

          <FTextField
            name="tags"
            label="Tag"
            placeholder="Enter tag"
            onClick={() => clearErrors("responseError")}
          />

          <FTextField
            name="slug"
            label="Slug"
            placeholder="your-post-slug"
            required
            onClick={() => clearErrors("responseError")}
          />

          {/* Event-specific fields */}
          {postType === "events" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-xl font-semibold">Event Details</h3>
              <FTextField
                name="event_details.date"
                label="Event Date"
                type="datetime-local"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="event_details.location"
                label="Location"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="event_details.description"
                label="Description"
                required
                onClick={() => clearErrors("responseError")}
              />
            </div>
          )}

          {/* Restaurant-specific fields */}
          {postType === "restaurants" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-xl font-semibold">Restaurant Details</h3>
              <FTextField
                name="restaurant_details.longitude"
                label="Longitude"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="restaurant_details.latitude"
                label="Latitude"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="restaurant_details.address"
                label="Address"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="restaurant_details.opening_hours"
                label="Opening Hours"
                required
                onClick={() => clearErrors("responseError")}
              />
              <FTextField
                name="restaurant_details.price_range"
                label="Price Range"
                required
                onClick={() => clearErrors("responseError")}
              />
            </div>
          )}

          {/* Error message */}
          {errors.responseError && (
            <p className="text-red-500">{errors.responseError.message}</p>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                ? "Update Post"
                : "Create Post"}
            </button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

export default PostManagementPage;
