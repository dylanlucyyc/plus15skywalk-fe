import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
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
    is: "event",
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
    is: "restaurant",
    then: () =>
      Yup.object().shape({
        longitude: Yup.number().required("Longitude is required"),
        latitude: Yup.number().required("Latitude is required"),
        price_range: Yup.string().required("Price range is required"),
        category: Yup.array()
          .of(Yup.string())
          .required("At least one category is required"),
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
    price_range: "",
    category: [],
  },
};

function PostManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(postId);
  const [restaurantCategories, _setRestaurantCategories] = useState([
    { _id: "1", name: "Vietnamese" },
    { _id: "2", name: "Japanese" },
    { _id: "3", name: "Korean" },
    { _id: "4", name: "Chinese" },
    { _id: "5", name: "Western" },
  ]);

  // Add authentication check
  const { isAuthenticated, isInitialized } = useAuth();

  console.log(isAuthenticated, isInitialized);

  useEffect(() => {
    // Redirect to signin page if user is not authenticated
    if (isInitialized && !isAuthenticated) {
      navigate("/signin", {
        state: {
          from: { pathname: postId ? `/post/edit/${postId}` : "/post/new" },
        },
      });
    }
  }, [isInitialized, isAuthenticated, navigate, postId]);

  const methods = useForm({
    resolver: yupResolver(postSchema),
    defaultValues,
  });

  const { watch, reset, setValue } = methods;
  const postType = watch("post_type");
  const title = watch("title");
  const _content = watch("content");

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
          const post = await dispatch(getPostById(postId)).unwrap();

          console.log(post);
          // Convert tags array to string
          const formattedPost = {
            ...post,
            tags: post.tags?.join(", ") || "",
            restaurant_details: {
              ...post.restaurant_details,
              category: post.restaurant_details?.category || [],
            },
          };

          // Format the date to be compatible with datetime-local input
          if (formattedPost.event_details?.date) {
            const date = new Date(formattedPost.event_details.date);
            if (!isNaN(date.getTime())) {
              // Format as YYYY-MM-DDThh:mm
              formattedPost.event_details.date = date
                .toISOString()
                .slice(0, 16);
            }
          }

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

      // Ensure slug is not null or empty
      if (!data.slug) {
        throw new Error("Slug is required");
      }

      // Convert tags string to array and clean up
      if (data.tags) {
        data.tags = data.tags
          .split(",")
          .map((tag) => tag.trim().replace(/^"|"$/g, "")); // Remove quotes if present
      }

      // If we have an event date, ensure it's properly formatted when sending to the API
      if (data.event_details?.date) {
        // Create a Date object from the input value and convert to ISO format
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
            helperText="URL-friendly version of your post title (auto-generated, but can be edited)"
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
                  // Ensure the date format is compatible with the HTML datetime-local input
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {restaurantCategories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={category._id}
                        onChange={(e) => {
                          const currentCategories =
                            methods.getValues("restaurant_details.category") ||
                            [];
                          if (e.target.checked) {
                            methods.setValue("restaurant_details.category", [
                              ...currentCategories,
                              category._id,
                            ]);
                          } else {
                            methods.setValue(
                              "restaurant_details.category",
                              currentCategories.filter(
                                (id) => id !== category._id
                              )
                            );
                          }
                        }}
                        checked={methods
                          .watch("restaurant_details.category")
                          ?.includes(category._id)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
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
