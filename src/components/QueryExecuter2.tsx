import { Box, Button, Grid, TextareaAutosize } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import React, { useEffect, useState } from "react";

const QueryExecuter2: React.FC = () => {
  const [queryResult, setQueryResult] = useState<unknown>(null);

  useEffect(() => {
    const handleMessageUpdate = () => {
      console.log("Handling message update in Tab component");
      const message = window.query1Result;
      if (message) {
        setQueryResult(message);
        console.log("Tab received message:", message);
      }
    };

    window.addEventListener(
      "main-process-message-updated",
      handleMessageUpdate
    );

    return () => {
      window.removeEventListener(
        "main-process-message-updated",
        handleMessageUpdate
      );
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
        <Button variant="contained">Execute</Button>
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
          "This is executer 2. Your result will be displayed here"
        )}
      </Box>
    </>
  );
};

export default QueryExecuter2;
