import React from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ICellRendererParams } from "ag-grid-community";

export const EditButtonRenderer: React.FC<ICellRendererParams> = (props) => {
  const handleEdit = () => {
    const { api, node } = props;
    if (node.rowIndex !== null) {
      const rowIndex: number = node.rowIndex; // Фиксируем rowIndex как number
      api.startEditingCell({
        rowIndex, // Используем зафиксированное значение
        colKey: "role_id",
      });
      setTimeout(() => {
        api.startEditingCell({
          rowIndex, // Здесь тоже используем зафиксированное значение
          colKey: "status_id",
        });
      }, 0);
    } else {
      console.warn("Cannot start editing: rowIndex is null");
    }
  };

  return (
    <IconButton onClick={handleEdit}>
      <EditIcon />
    </IconButton>
  );
};
