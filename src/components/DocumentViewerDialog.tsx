import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FaSearch,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaRegCopy,
  FaCheck,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import JsonTreeView from "./JsonTreeView";
import {
  findJsonMatches,
  getAllContainerPaths,
  getInitialExpandedPaths,
} from "../utils/jsonTreeUtils";
import { DocumentModalData } from "./DocumentEditorDialog";

export interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDocument: DocumentModalData | null;
  onEditClick?: () => void;
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({
  open,
  onClose,
  selectedDocument,
  onEditClick,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize expanded paths when document changes
  useEffect(() => {
    if (selectedDocument?.documentData) {
      setExpandedPaths(getInitialExpandedPaths(selectedDocument.documentData, 2));
      setSearchQuery("");
      setActiveMatchIndex(0);
      setIsSearchOpen(false);
    }
  }, [selectedDocument]);

  // Compute search matches
  const { matches, matchMap, ancestorPathsToExpand } = useMemo(() => {
    if (!selectedDocument?.documentData || !searchQuery.trim()) {
      return {
        matches: [],
        matchMap: new Map(),
        ancestorPathsToExpand: new Set<string>(),
      };
    }
    return findJsonMatches(
      selectedDocument.documentData,
      searchQuery,
      isCaseSensitive
    );
  }, [selectedDocument?.documentData, searchQuery, isCaseSensitive]);

  // Auto-expand matched branches when search results change
  useEffect(() => {
    if (ancestorPathsToExpand.size > 0) {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        ancestorPathsToExpand.forEach((p) => next.add(p));
        return next;
      });
    }
    setActiveMatchIndex(0);
  }, [ancestorPathsToExpand]);

  // Scroll active match into view
  useEffect(() => {
    if (
      matches.length > 0 &&
      activeMatchIndex >= 0 &&
      activeMatchIndex < matches.length
    ) {
      const matchEl = document.getElementById(`json-match-${activeMatchIndex}`);
      if (matchEl) {
        matchEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeMatchIndex, matches]);

  // Keyboard shortcut Ctrl+F / Cmd+F handler
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }, 30);
      } else if (e.key === "Escape" && isSearchOpen) {
        if (document.activeElement === searchInputRef.current) {
          setIsSearchOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSearchOpen]);

  const handleTogglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (selectedDocument?.documentData) {
      setExpandedPaths(getAllContainerPaths(selectedDocument.documentData));
    }
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set([""]));
  };

  const handleNextMatch = () => {
    if (matches.length === 0) return;
    setActiveMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const handlePrevMatch = () => {
    if (matches.length === 0) return;
    setActiveMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrevMatch();
      } else {
        handleNextMatch();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchOpen(false);
    }
  };

  const handleCopyJson = async () => {
    if (!selectedDocument?.documentData) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(selectedDocument.documentData, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
    onClose();
  };

  const formattedJsonText = useMemo(() => {
    if (!selectedDocument?.documentData) return "";
    return JSON.stringify(selectedDocument.documentData, null, 2);
  }, [selectedDocument?.documentData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            minWidth: "600px",
            minHeight: "500px",
            maxWidth: "92vw",
            maxHeight: "90vh",
            resize: "both",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Document: {selectedDocument?.documentId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Collection: {selectedDocument?.collection}
            </Typography>
          </Box>

          {/* Quick Action Toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Search (Ctrl + F)">
              <Button
                variant={isSearchOpen ? "contained" : "outlined"}
                size="small"
                startIcon={<FaSearch />}
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  if (!isSearchOpen) {
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                      searchInputRef.current?.select();
                    }, 50);
                  }
                }}
              >
                Find
              </Button>
            </Tooltip>

            {tabIndex === 0 && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleExpandAll}
                >
                  Expand All
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCollapseAll}
                >
                  Collapse All
                </Button>
              </>
            )}

            <Tooltip title={copied ? "Copied to clipboard!" : "Copy Full JSON"}>
              <Button
                size="small"
                variant="outlined"
                color={copied ? "success" : "inherit"}
                startIcon={copied ? <FaCheck /> : <FaRegCopy />}
                onClick={handleCopyJson}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Tooltip>

            {onEditClick && (
              <Tooltip title="Edit this document">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<FaPencil />}
                  onClick={onEditClick}
                >
                  Edit
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* View Mode Tabs */}
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <Tabs
            value={tabIndex}
            onChange={(_e, val) => setTabIndex(val)}
            sx={{ minHeight: "36px", "& .MuiTab-root": { minHeight: "36px", py: 0 } }}
          >
            <Tab label="Tree View" />
            <Tab label="Raw JSON" />
          </Tabs>
        </Box>
      </DialogTitle>

      {/* Ctrl + F Search Bar */}
      {isSearchOpen && (
        <Paper
          elevation={2}
          sx={{
            p: 1,
            px: 2,
            bgcolor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder="Find in document (Ctrl+F)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            autoFocus
            sx={{ flex: 1, bgcolor: "#ffffff", maxWidth: "450px" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch color="#666" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                    >
                      <FaTimes size={12} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Match Counter */}
          {searchQuery.trim() !== "" && (
            <Chip
              size="small"
              label={
                matches.length > 0
                  ? `${activeMatchIndex + 1} of ${matches.length} matches`
                  : "No matches"
              }
              color={matches.length > 0 ? "primary" : "default"}
              variant={matches.length > 0 ? "filled" : "outlined"}
            />
          )}

          {/* Match Navigation Buttons */}
          <Tooltip title="Previous match (Shift + Enter)">
            <span>
              <IconButton
                size="small"
                onClick={handlePrevMatch}
                disabled={matches.length === 0}
              >
                <FaArrowUp />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Next match (Enter)">
            <span>
              <IconButton
                size="small"
                onClick={handleNextMatch}
                disabled={matches.length === 0}
              >
                <FaArrowDown />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={isCaseSensitive ? "Case sensitive (ON)" : "Match case (OFF)"}>
            <Button
              size="small"
              variant={isCaseSensitive ? "contained" : "outlined"}
              onClick={() => setIsCaseSensitive((prev) => !prev)}
              sx={{ minWidth: "32px", px: 1, fontWeight: "bold", fontSize: "12px" }}
            >
              Aa
            </Button>
          </Tooltip>

          <Tooltip title="Close Search (Esc)">
            <IconButton
              size="small"
              onClick={() => setIsSearchOpen(false)}
            >
              <FaTimes />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      {/* Content Area */}
      <DialogContent
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "#fafafa",
          p: 2,
        }}
      >
        {selectedDocument?.documentData ? (
          tabIndex === 0 ? (
            <JsonTreeView
              data={selectedDocument.documentData}
              matchMap={matchMap}
              activeMatchIndex={activeMatchIndex}
              expandedPaths={expandedPaths}
              onTogglePath={handleTogglePath}
            />
          ) : (
            <Box
              component="pre"
              sx={{
                p: 2,
                m: 0,
                bgcolor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "12px",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {formattedJsonText}
            </Box>
          )
        ) : (
          <Typography color="text.secondary">No document data.</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
          Tip: Press <strong>Ctrl + F</strong> to search anywhere in this document
        </Typography>
        <Button onClick={handleClose} variant="contained" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewerDialog;
