import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getChecks, getObjects, getOperators } from "../api";
import { CalendarFilter, Check, Object, Operator } from "../types";

export const useCalendar = () => {
  const [filters, setFilters] = useState<CalendarFilter>({
    status: "all",
    objectId: null,
    operatorId: null,
  });

  const checksQuery = useQuery<Check[], Error>({
    queryKey: ["checks", filters],
    queryFn: () => getChecks(filters),
  });

  const objectsQuery = useQuery<Object[], Error>({
    queryKey: ["objects"],
    queryFn: getObjects,
  });

  const operatorsQuery = useQuery<Operator[], Error>({
    queryKey: ["operators"],
    queryFn: getOperators,
  });

  const resetFilters = () => {
    setFilters({ status: "all", objectId: null, operatorId: null });
  };

  return {
    filters,
    setFilters,
    checks: checksQuery.data || [],
    isLoading: checksQuery.isLoading,
    error: checksQuery.error?.message,
    objects: objectsQuery.data || [],
    operators: operatorsQuery.data || [],
    resetFilters,
  };
};
