import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.detail || "Network Error";
    toast.error(message);
  } else {
    toast.error("Unexpected error occurred");
  }
};
