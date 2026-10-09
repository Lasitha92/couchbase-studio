import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import DocumentExecuterTable from "./DocumentExecuterTable";

const DocumentExecuter: React.FC = () => {
  const [queryResult, setQueryResult] = useState<
    DocumentExecuterResult[] | null
  >(() => window.document1Result);

  const [collections, setCollections] = useState<string[]>(
    () => window.collections || []
  );

  const [inputs, setInputs] = useState(
    () =>
      window.documentExecuter1Input || {
        collection: "",
        documentId: "",
        whereClause: "",
        limit: "",
      }
  );

  useEffect(() => {
    const handleResultsUpdated = () => {
      const result = window.document1Result;
      if (result) {
        setQueryResult(result);
      }
    };

    const handleCollectionsUpdate = () => {
      const collections = window.collections || [];
      if (collections.length > 0) {
        setCollections(collections);
        setInputs((i) => ({ ...i, collection: collections[0] }));
      }
    };

    window.addEventListener("document-result-1-updated", handleResultsUpdated);
    window.addEventListener(
      "available-collections-updated",
      handleCollectionsUpdate
    );

    return () => {
      window.removeEventListener(
        "document-result-1-updated",
        handleResultsUpdated
      );
      window.removeEventListener(
        "available-collections-updated",
        handleCollectionsUpdate
      );
    };
  }, []);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    window.documentExecuter1Input = newInputs;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Grid container spacing={1.5} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={collections}
            id="collection-selector"
            disableClearable
            size="small"
            value={inputs.collection}
            onChange={(_event, newValue) => {
              handleInputChange("collection", newValue || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Collection" variant="outlined" />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            size="small"
            label="Document ID"
            variant="outlined"
            fullWidth
            value={inputs.documentId}
            onChange={(e) => handleInputChange("documentId", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 4.5 }}>
          <TextField
            size="small"
            label="Where clause"
            variant="outlined"
            fullWidth
            value={inputs.whereClause}
            onChange={(e) => handleInputChange("whereClause", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 1.5 }}>
          <TextField
            size="small"
            label="Limit"
            variant="outlined"
            fullWidth
            type="number"
            value={inputs.limit}
            onChange={(e) => handleInputChange("limit", e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlay size={11} />}
          onClick={() => {
            window.ipcRenderer.send("document-1-execute", inputs);
          }}
          sx={{ px: 2.5 }}
        >
          Execute
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "300px",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <DocumentExecuterTable
          queryResult={queryResult}
          collection={inputs.collection}
        />
      </Paper>
    </Box>
  );
};

export default DocumentExecuter;
