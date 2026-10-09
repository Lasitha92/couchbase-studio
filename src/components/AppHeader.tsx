import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
} from "@mui/material";
import { FaSun, FaMoon, FaDatabase } from "react-icons/fa";
import { useColorMode } from "../theme/useColorMode";

export const AppHeader: React.FC = () => {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  const [isConnected, setIsConnected] = useState<boolean>(
    () => (window.collections && window.collections.length > 0) || false
  );
  const [bucketInfo, setBucketInfo] = useState<string>(() => {
    return window.appConfig?.bucketName || "";
  });

  useEffect(() => {
    const handleCollectionsUpdate = () => {
      const collections = window.collections || [];
      setIsConnected(collections.length > 0);
    };

    const handleConfigUpdate = () => {
      if (window.appConfig?.bucketName) {
        setBucketInfo(window.appConfig.bucketName);
      }
    };

    window.addEventListener(
      "available-collections-updated",
      handleCollectionsUpdate
    );
    window.addEventListener("app-config-updated", handleConfigUpdate);

    return () => {
      window.removeEventListener(
        "available-collections-updated",
        handleCollectionsUpdate
      );
      window.removeEventListener("app-config-updated", handleConfigUpdate);
    };
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: mode === "dark" ? "#14161a" : "#ffffff",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        px: 1,
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          minHeight: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand & Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "#ffffff",
              width: 30,
              height: 30,
              borderRadius: "6px",
            }}
          >
            <FaDatabase size={15} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Couchbase Studio
          </Typography>
          <Chip
            label="v1.3.0"
            size="small"
            sx={{
              height: 20,
              fontSize: "11px",
              fontWeight: 600,
              bgcolor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              color: "text.secondary",
            }}
          />
        </Box>

        {/* Right Section: Connection Badge & Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            size="small"
            variant="outlined"
            label={
              isConnected
                ? bucketInfo
                  ? `Connected: ${bucketInfo}`
                  : "Connected"
                : "Not Connected"
            }
            sx={{
              height: 24,
              fontSize: "12px",
              fontWeight: 500,
              borderColor: isConnected
                ? theme.palette.success.main
                : theme.palette.divider,
              color: isConnected
                ? theme.palette.success.main
                : theme.palette.text.secondary,
              "& .MuiChip-label": {
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              },
              "&::before": {
                content: '""',
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                ml: 1,
                bgcolor: isConnected
                  ? theme.palette.success.main
                  : theme.palette.text.disabled,
              },
            }}
          />

          <Tooltip
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            <IconButton
              size="small"
              onClick={toggleColorMode}
              sx={{
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "6px",
                p: "5px",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
            >
              {mode === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
