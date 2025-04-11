// src/features/user-list/components/CheckboxRenderer.tsx

import React from "react";
import { Checkbox } from "@mui/material";
import { ICellRendererParams } from "ag-grid-community";
import { User } from "@/entities/user";

export const CheckboxRenderer: React.FC<ICellRendererParams<User>> = (
  props
) => {
  const { node, api } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    node.setSelected(event.target.checked);
    api.refreshCells({ force: true });
  };

  return (
    <Checkbox
      checked={node.isSelected()}
      onChange={handleChange}
      color="primary"
    />
  );
};
