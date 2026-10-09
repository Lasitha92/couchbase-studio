import { Box, Button, Paper, Typography } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useColorMode } from "../theme/useColorMode";

const QueryExecuter3: React.FC = () => {
  const { mode } = useColorMode();
  const [queryResult, setQueryResult] = useState<unknown>(
    () => window.query3Result
  );
  const [query, setQuery] = useState(() => window.query3Text || "");

  useEffect(() => {
    const handleMessageUpdate = () => {
      const message = window.query3Result;
      if (message) {
        setQueryResult(message);
      }
    };

    window.addEventListener("query-result-3-updated", handleMessageUpdate);

    return () => {
      window.removeEventListener("query-result-3-updated", handleMessageUpdate);
    };
  }, []);

  const isDark = mode === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ position: "relative" }}>
        <textarea
          rows={5}
          placeholder="Enter N1QL / SQL++ query (e.g. SELECT * FROM `bucket` LIMIT 10;)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            window.query3Text = e.target.value;
          }}
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontFamily:
              'ui-monospace, "SF Mono", "Fira Code", Consolas, monospace',
            fontSize: "13px",
            lineHeight: "1.6",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: isDark ? "#14161a" : "#ffffff",
            color: isDark ? "#e6edf3" : "#1f2328",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.15)"
              : "1px solid rgba(0, 0, 0, 0.15)",
            outline: "none",
            resize: "vertical",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#EA2328";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.15)";
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlay size={11} />}
          onClick={() => window.ipcRenderer.send("query-3-execute", query)}
          sx={{ px: 2.5 }}
        >
          Execute Query
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: "300px",
          p: 2,
          borderRadius: "6px",
          bgcolor: isDark ? "#14161a" : "#ffffff",
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
            Query 3 results will appear here once executed.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default QueryExecuter3;
