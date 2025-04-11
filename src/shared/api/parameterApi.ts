import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { Parameter } from "@/entities/parameter";

export const parameterApi = {
  addParameter: async (name: string): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/parameters", { id: Date.now(), name });
    } else {
      await api.post("/add-new-parameter", { name });
    }
  },
  editParameter: async (id: number, name: string): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/parameters/${id}`, { name });
    } else {
      await api.put("/edit-parameter", { id, name });
    }
  },
  deleteParameter: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/parameters/${id}`);
    } else {
      await api.delete("/delete-parameter", { data: { id } });
    }
  },
  getParameters: async (): Promise<Parameter[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/parameters")
      : await api.get("/parameters");
    return response.data;
  },
  addObjectType: async (
    name: string,
    parameter_ids: number[]
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/object-types", {
        id: Date.now(),
        name,
        parameter_ids,
      });
    } else {
      await api.post("/add-object-type", { name, parameter_ids });
    }
  },
  editObjectType: async (
    id: number,
    name: string,
    parameter_ids: number[]
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/object-types/${id}`, { name, parameter_ids });
    } else {
      await api.put("/edit-object-type", { id, name, parameter_ids });
    }
  },
  deleteObjectType: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/object-types/${id}`);
    } else {
      await api.delete("/delete-object-type", { data: { id } });
    }
  },
  getObjectTypeParameters: async (id: number): Promise<Parameter[]> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get(`/object-types/${id}`);
      const parameterIds = response.data.parameter_ids;
      const paramsResponse = await testApi.get("/parameters");
      return paramsResponse.data.filter((param: Parameter) =>
        parameterIds.includes(param.id)
      );
    } else {
      const response = await api.get("/object-type-parameters", {
        params: { id },
      });
      return response.data;
    }
  },
};
