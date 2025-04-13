import { useQuery } from "@tanstack/react-query";
import { getDefects } from "@/shared/api/defectsApi";
import { Defect } from "@/entities/defect";
import { useState } from "react";

export interface DefectFilters {
  object: string;
  operator: string;
  date: string;
}

export const useDefects = () => {
  const [filters, setFilters] = useState<DefectFilters>({
    object: "",
    operator: "",
    date: "",
  });

  const { data, isLoading, error } = useQuery<Defect[], Error>({
    queryKey: ["defects", filters],
    queryFn: () => getDefects(filters),
  });

  return {
    defects: data || [],
    isLoading,
    error: error?.message,
    filters,
    setFilters,
  };
};
