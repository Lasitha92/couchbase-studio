import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const DocumentExecuter1: React.FC = () => {
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
    <>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Autocomplete
            options={collections}
            id="collection-selector"
            disableClearable
            value={inputs.collection}
            onChange={(_event, newValue) => {
              handleInputChange("collection", newValue || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Collection" variant="outlined" />
            )}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            label="Document ID"
            variant="outlined"
            fullWidth
            value={inputs.documentId}
            onChange={(e) => handleInputChange("documentId", e.target.value)}
          ></TextField>
        </Grid>
        <Grid size={5}>
          <TextField
            label="Where clause"
            variant="outlined"
            fullWidth
            value={inputs.whereClause}
            onChange={(e) => handleInputChange("whereClause", e.target.value)}
          ></TextField>
        </Grid>
        <Grid size={1}>
          <TextField
            label="Limit"
            variant="outlined"
            fullWidth
            type="number"
            value={inputs.limit}
            onChange={(e) => handleInputChange("limit", e.target.value)}
          ></TextField>
        </Grid>
      </Grid>
      <Box
        component="pre"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            window.ipcRenderer.send("document-1-execute", inputs);
          }}
        >
          Execute
        </Button>
      </Box>

      <Box
        component="pre"
        sx={{
          bgcolor: "grey.200",
          width: "100%",
          minHeight: "300px",
          display: "flex",
          alignItems: "left",
        }}
      >
        {queryResult ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">DOCUMENT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryResult.map((row) => (
                  <TableRow
                    key={row.meta.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <ButtonGroup
                        variant="contained"
                        aria-label="Basic button group"
                      >
                        <Button>
                          <FaPencil />
                        </Button>
                        <Button>
                          <FaRegTrashAlt />{" "}
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell align="left">{row.meta.id}</TableCell>
                    <TableCell align="left">
                      {JSON.stringify(row.data).slice(0, 300)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          "This is executer 1. Your result will be displayed here"
        )}
      </Box>
    </>
  );
};

export default DocumentExecuter1;
