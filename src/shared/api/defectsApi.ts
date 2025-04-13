import axios from "./axios";

export const getDefects = async (filters: {
  object?: string;
  operator?: string;
  date?: string;
}) => {
  const response = await axios.api.get("/defects", { params: filters });
  return response.data;
};
