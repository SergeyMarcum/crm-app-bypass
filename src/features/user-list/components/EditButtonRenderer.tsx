import React from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ICellRendererParams } from "ag-grid-community";

export const EditButtonRenderer: React.FC<ICellRendererParams> = (props) => {
  const handleEdit = () => {
    if (props.node.rowIndex !== null) {
      props.api.startEditingCell({
        rowIndex: props.node.rowIndex,
        colKey: "role", // Начинаем редактирование с поля "Права доступа"
      });
    }
  };

  return (
    <IconButton onClick={handleEdit}>
      <EditIcon />
    </IconButton>
  );
};
