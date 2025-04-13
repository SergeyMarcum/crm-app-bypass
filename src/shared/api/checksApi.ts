import axios from "./axios";

export const getChecks = async (filters: {
  object?: string;
  operator?: string;
  date?: string;
}) => {
  const response = await axios.api.get("/checks", { params: filters });
  return response.data;
};
