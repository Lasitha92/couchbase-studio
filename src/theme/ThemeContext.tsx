import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { ColorMode, ColorModeContext } from "./useColorMode";

const COUCHBASE_RED = "#EA2328";

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ColorMode>(() => {
    const saved = localStorage.getItem("couchbase_studio_theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "dark";
  });

  useEffect(() => {
    localStorage.setItem("couchbase_studio_theme", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setMode = (newMode: ColorMode) => {
    setModeState(newMode);
  };

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        primary: {
          main: COUCHBASE_RED,
          light: "#F05357",
          dark: "#C41C20",
          contrastText: "#ffffff",
        },
        secondary: {
          main: isDark ? "#58a6ff" : "#0969da",
        },
        background: {
          default: isDark ? "#0f1115" : "#f6f8fa",
          paper: isDark ? "#181a1f" : "#ffffff",
        },
        text: {
          primary: isDark ? "#e6edf3" : "#1f2328",
          secondary: isDark ? "#8b949e" : "#656d76",
        },
        divider: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ].join(","),
        button: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 6,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              textTransform: "none",
              fontSize: "14px",
              minHeight: 44,
              "&.Mui-selected": {
                color: COUCHBASE_RED,
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: {
              backgroundColor: COUCHBASE_RED,
              height: 3,
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            size: "small",
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 8,
              border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
