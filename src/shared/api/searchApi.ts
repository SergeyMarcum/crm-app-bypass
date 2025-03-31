import axios from "axios";

export const searchApi = {
  search: async (query: string) => {
    const response = await axios.get("/api/search", {
      params: { q: query },
    });
    return response.data;
  },
};
