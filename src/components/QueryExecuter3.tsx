import { Box, Button, Grid, TextareaAutosize } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import React, { useEffect, useState } from "react";

const QueryExecuter3: React.FC = () => {
  const [mainProcessMessage, setMainProcessMessage] = useState<unknown>(null);

  useEffect(() => {
    const handleMessageUpdate = () => {
      console.log("Handling message update in Tab component");
      const message = window.query1Result;
      if (message) {
        setMainProcessMessage(message);
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
      <Grid container size={12} spacing={2} padding={1}>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={6}
          placeholder="Minimum 3 rows"
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid
        container
        size={12}
        spacing={2}
        padding={1}
        justifyContent={"center"}
      >
        <Button variant="contained">Execute</Button>
      </Grid>
      <Grid container size={12} spacing={2} padding={1}>
        <Box
          component="pre"
          sx={{
            bgcolor: "grey.200",
            p: 2,
            width: "100%",
            minHeight: "300px",
            display: "flex",
            alignItems: "left",
          }}
        >
          {mainProcessMessage ? (
            <JsonView value={mainProcessMessage} displayDataTypes={false} />
          ) : (
            "This is executer 3. Your result will be displayed here"
          )}
        </Box>
      </Grid>
    </>
  );
};

export default QueryExecuter3;
