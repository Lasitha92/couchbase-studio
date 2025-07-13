import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";

export interface DocumentModalData {
  documentId: string;
  documentData: Record<string, unknown>;
  collection: string;
}

interface DocumentEditorDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDocument: DocumentModalData | null;
  onSave?: (documentId: string, updatedData: Record<string, unknown>) => void;
}

const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({
  open,
  onClose,
  selectedDocument,
  onSave,
}) => {
  const [editedContent, setEditedContent] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState<boolean>(true);

  useEffect(() => {
    if (selectedDocument?.documentData) {
      setEditedContent(JSON.stringify(selectedDocument.documentData, null, 2));
      setIsValidJson(true);
    }
  }, [selectedDocument]);

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = event.target.value;
    setEditedContent(newContent);

    // Validate JSON
    try {
      JSON.parse(newContent);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handleSave = () => {
    if (!isValidJson || !selectedDocument || !onSave) return;

    try {
      const parsedData = JSON.parse(editedContent);
      onSave(selectedDocument.documentId, parsedData);
      onClose();
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleClose = () => {
    setEditedContent("");
    setIsValidJson(true);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "80vh",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Document: {selectedDocument?.documentId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Collection: {selectedDocument?.collection}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ flex: 1, overflow: "auto" }}>
        {selectedDocument?.documentData && (
          <Box sx={{ mt: 2 }}>
            <TextField
              multiline
              fullWidth
              value={editedContent}
              onChange={handleContentChange}
              error={!isValidJson}
              helperText={!isValidJson ? "Invalid JSON format" : ""}
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "monospace",
                  fontSize: "14px",
                },
              }}
              InputProps={{
                style: {
                  fontFamily: "monospace",
                  fontSize: "14px",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValidJson || !onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentEditorDialog;
