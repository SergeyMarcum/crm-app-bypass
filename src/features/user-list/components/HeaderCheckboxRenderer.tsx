import React, { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import { IHeaderParams } from "ag-grid-community";

export const HeaderCheckboxRenderer: React.FC<IHeaderParams> = (props) => {
  const { api } = props;
  const [selectedCount, setSelectedCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCounts = () => {
      setSelectedCount(api.getSelectedRows()?.length || 0);
      setDisplayedCount(api.getDisplayedRowCount() || 0);
    };

    updateCounts();
    api.addEventListener("rowSelected", updateCounts);
    api.addEventListener("modelUpdated", updateCounts);

    return () => {
      api.removeEventListener("rowSelected", updateCounts);
      api.removeEventListener("modelUpdated", updateCounts);
    };
  }, [api]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!api) return;
    if (event.target.checked) {
      api.selectAll();
    } else {
      api.deselectAll();
    }
  };

  if (!api) {
    return <Checkbox disabled color="primary" />;
  }

  return (
    <Checkbox
      checked={selectedCount === displayedCount && displayedCount > 0}
      indeterminate={selectedCount > 0 && selectedCount < displayedCount}
      onChange={handleChange}
      color="primary"
    />
  );
};
