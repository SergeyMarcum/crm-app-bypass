import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { Object } from "@/entities/object";

export const objectApi = {
  addObject: async (
    name: string,
    address: string,
    parameters: number[]
  ): Promise<void> => {
    const { isTestMode, domain } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/all-domain-objects", {
        id: Date.now().toString(),
        name,
        address,
        parameters,
        domain,
      });
    } else {
      await api.post("/add-new-object", { name, address, parameters });
    }
  },
  editObject: async (
    id: number,
    name: string,
    address: string,
    parameters: number[]
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/all-domain-objects/${id}`, {
        name,
        address,
        parameters,
      });
    } else {
      await api.put("/edit-object", { id, name, address, parameters });
    }
  },
  deleteObject: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/all-domain-objects/${id}`);
    } else {
      await api.delete("/delete-object", { data: { id } });
    }
  },
  getDomainObjects: async (): Promise<Object[]> => {
    const { isTestMode, domain } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/all-domain-objects")
      : await api.get("/all-domain-objects");
    return response.data.filter((obj: Object) => obj.domain === domain);
  },
  getAllObjects: async (): Promise<Object[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/all-domain-objects")
      : await api.get("/all-objects");
    return response.data;
  },
};
