import { Box, Button, Grid, TextareaAutosize } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import React, { useEffect, useState } from "react";

const QueryExecuter1: React.FC = () => {
  const [queryResult, setQueryResult] = useState<unknown>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleMessageUpdate = () => {
      const message = window.query1Result;
      if (message) {
        setQueryResult(message);
      }
    };

    window.addEventListener("query-result-1-updated", handleMessageUpdate);

    return () => {
      window.removeEventListener("query-result-1-updated", handleMessageUpdate);
    };
  }, []);

  return (
    <>
      <Grid container size={12} spacing={1}>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={6}
          placeholder="Minimum 3 rows"
          style={{ width: "100%" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
          onClick={() => window.ipcRenderer.send("query-1-execute", query)}
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
          <JsonView value={queryResult} displayDataTypes={false} />
        ) : (
          "This is executer 1. Your result will be displayed here"
        )}
      </Box>
    </>
  );
};

export default QueryExecuter1;
