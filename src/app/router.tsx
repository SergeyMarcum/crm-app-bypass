import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router-config";

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
