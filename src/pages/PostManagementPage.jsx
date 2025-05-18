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
  // Event details
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
  // Restaurant details
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

  // Add authentication check
  const { isAuthenticated, isInitialized } = useAuth();
  const { currentUser } = useSelector((state) => state.post);

  // Use either auth context or Redux for authentication check
  const isUserAuthenticated = isAuthenticated || !!currentUser;

  useEffect(() => {
    // Redirect to signin page if user is not authenticated
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

  const { watch, reset, setValue } = methods;
  const postType = watch("post_type");
  const title = watch("title");
  const _content = watch("content");

  // Initialize specific fields when post type changes
  useEffect(() => {
    if (postType === "restaurants" && !isEditMode) {
      // Make sure restaurant_details is initialized
      const currentRestaurantDetails =
        methods.getValues("restaurant_details") || {};
      console.log("Initializing restaurant details:", currentRestaurantDetails);

      // Set default values if they're not already set
      setValue("restaurant_details", {
        longitude: currentRestaurantDetails.longitude || "",
        latitude: currentRestaurantDetails.latitude || "",
        address: currentRestaurantDetails.address || "",
        opening_hours: currentRestaurantDetails.opening_hours || "",
        price_range: currentRestaurantDetails.price_range || "",
      });
    }
  }, [postType, isEditMode, setValue]);

  // Generate slug from title
  useEffect(() => {
    if (title && !isEditMode) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 100); // Limit length
      setValue("slug", generatedSlug);
    }
  }, [title, setValue, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const { post } = await dispatch(getPostById(postId)).unwrap();

          console.log(post);
          // Convert tags array to string
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

      console.log("Form data before processing:", data);
      console.log("Post type:", data.post_type);
      console.log("Restaurant details:", data.restaurant_details);

      // Ensure slug is not null or empty
      if (!data.slug) {
        throw new Error("Slug is required");
      }

      // Tags are now sent as a simple string, no conversion needed

      // If we have an event date, ensure it's properly formatted when sending to the API
      if (data.event_details?.date) {
        // Create a Date object from the input value and convert to ISO format
        const dateObj = new Date(data.event_details.date);
        if (!isNaN(dateObj.getTime())) {
          data.event_details.date = dateObj.toISOString();
        }
      }

      // Fix for MongoDB ObjectId cast error with categories
      if (data.post_type === "restaurants" && data.restaurant_details) {
        console.log("Original restaurant details:", data.restaurant_details);
        console.log(
          "Final restaurant details:",
          JSON.stringify(data.restaurant_details)
        );
      }

      if (isEditMode) {
        await dispatch(updatePost({ postId, postData: data })).unwrap();
      } else {
        await dispatch(createPost(data)).unwrap();
      }

      navigate(`/${data.post_type}/${data.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <FSelect name="post_type" label="Post Type" required>
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
          />

          <FEditor name="content" label="Content" required />

          <FTextField
            name="image"
            label="Image URL"
            placeholder="https://example.com/image.jpg"
          />

          <FTextField
            name="tags"
            label="Tags (comma-separated)"
            placeholder="tag1, tag2, tag3"
          />

          <FTextField
            name="slug"
            label="Slug"
            placeholder="your-post-slug"
            required
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
                inputProps={{
                  pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}",
                }}
              />
              <FTextField
                name="event_details.location"
                label="Location"
                required
              />
              <FTextField
                name="event_details.description"
                label="Description"
                multiline={true}
                rows={3}
                required
              />
            </div>
          )}

          {/* Restaurant-specific fields */}
          {postType === "restaurants" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-xl font-semibold">Restaurant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FTextField
                  name="restaurant_details.longitude"
                  label="Longitude"
                  type="number"
                  step="any"
                  required
                />
                <FTextField
                  name="restaurant_details.latitude"
                  label="Latitude"
                  type="number"
                  step="any"
                  required
                />
              </div>
              <FTextField
                name="restaurant_details.address"
                label="Address"
                required
              />
              <FTextField
                name="restaurant_details.opening_hours"
                label="Opening Hours"
                placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                required
              />
              <FSelect
                name="restaurant_details.price_range"
                label="Price Range"
                required
              >
                <option value="">Select price range</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </FSelect>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => methods.reset()}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

export default PostManagementPage;
