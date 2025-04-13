import { useQuery } from "@tanstack/react-query";
import { getChecks } from "@/shared/api/checksApi";
import { Check } from "@/entities/check";
import { useState } from "react";

export interface CheckFilters {
  object: string;
  operator: string;
  date: string;
}

export const useChecks = () => {
  const [filters, setFilters] = useState<CheckFilters>({
    object: "",
    operator: "",
    date: "",
  });

  const { data, isLoading, error } = useQuery<Check[], Error>({
    queryKey: ["checks", filters],
    queryFn: () => getChecks(filters),
  });

  return {
    checks: data || [],
    isLoading,
    error: error?.message,
    filters,
    setFilters,
  };
};
