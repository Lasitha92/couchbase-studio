import { Box, Button, Paper, Typography } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useColorMode } from "../theme/useColorMode";

const QueryExecuter2: React.FC = () => {
  const { mode } = useColorMode();
  const [queryResult, setQueryResult] = useState<unknown>(
    () => window.query2Result
  );
  const [query, setQuery] = useState(() => window.query2Text || "");

  useEffect(() => {
    const handleMessageUpdate = () => {
      const message = window.query2Result;
      if (message) {
        setQueryResult(message);
      }
    };

    window.addEventListener("query-result-2-updated", handleMessageUpdate);

    return () => {
      window.removeEventListener("query-result-2-updated", handleMessageUpdate);
    };
  }, []);

  const isDark = mode === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* Query Input Box with pure theme styling */}
      <Box
        component="textarea"
        rows={5}
        placeholder="Enter N1QL / SQL++ query (e.g. SELECT * FROM `bucket` LIMIT 10;)"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setQuery(e.target.value);
          window.query2Text = e.target.value;
        }}
        sx={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily:
            'ui-monospace, "SF Mono", "Fira Code", Consolas, monospace',
          fontSize: "13px",
          lineHeight: "1.6",
          p: 1.5,
          borderRadius: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:focus": {
            borderColor: "primary.main",
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
          },
        }}
      />

      {/* Action Row */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlay size={11} />}
          onClick={() => window.ipcRenderer.send("query-2-execute", query)}
          sx={{ px: 2.5 }}
        >
          Execute Query
        </Button>
      </Box>

      {/* Results Container */}
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "300px",
          p: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {queryResult ? (
          <JsonView
            value={queryResult as object}
            displayDataTypes={false}
            style={isDark ? darkTheme : githubLightTheme}
          />
        ) : (
          <Typography color="text.secondary" sx={{ fontSize: "13px" }}>
            Query 2 results will appear here once executed.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default QueryExecuter2;
