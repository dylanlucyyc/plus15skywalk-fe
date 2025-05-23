import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DisplayPosts from "../pages/DisplayPosts";
import SinglePostPage from "../pages/SinglePostPage";
import NotFoundPage from "../pages/NotFoundPage";
import UserProfilePage from "../pages/UserProfilePage";
import PostManagementPage from "../pages/PostManagementPage";
import NoSubscribeLayout from "../layouts/NoSubscribeLayout";
function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="news" element={<DisplayPosts />} />
        <Route path="news/:slug" element={<SinglePostPage />} />
        <Route path="events" element={<DisplayPosts />} />
        <Route path="events/:slug" element={<SinglePostPage />} />
        <Route path="restaurants" element={<DisplayPosts />} />
        <Route path="restaurants/:slug" element={<SinglePostPage />} />
        <Route path="user/me" element={<UserProfilePage />} />
        <Route path="user/:userId" element={<UserProfilePage />} />
      </Route>
      <Route path="/" element={<NoSubscribeLayout />}>
        <Route path="signin" element={<LoginPage />} />
        <Route path="signup" element={<RegisterPage />} />
        <Route path="post/new" element={<PostManagementPage />} />
        <Route path="post/edit/:postId" element={<PostManagementPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
