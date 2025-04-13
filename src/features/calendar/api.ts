import { testApi } from "@/shared/api/axios";
import { CalendarFilter, Check, Object, Operator } from "./types";

export const getChecks = async (filters: CalendarFilter): Promise<Check[]> => {
  const response = await testApi.get("/checks", {
    params: {
      status: filters.status !== "all" ? filters.status : undefined,
      objectId: filters.objectId,
      operatorId: filters.operatorId,
    },
  });
  return response.data;
};

export const getObjects = async (): Promise<Object[]> => {
  const response = await testApi.get("/all-domain-objects");
  return response.data;
};

export const getOperators = async (): Promise<Operator[]> => {
  const response = await testApi.get("/operators");
  return response.data;
};
