import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import JsonView from "@uiw/react-json-view";

export interface DocumentModalData {
  documentId: string;
  documentData: Record<string, unknown>;
  collection: string;
}

interface DocumentEditorDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDocument: DocumentModalData | null;
}

const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({
  open,
  onClose,
  selectedDocument,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            <JsonView
              value={selectedDocument.documentData}
              displayDataTypes={false}
              style={{ backgroundColor: "transparent" }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentEditorDialog;
