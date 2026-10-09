import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import DocumentEditorDialog, {
  DocumentModalData,
} from "./DocumentEditorDialog";
import DocumentViewerDialog from "./DocumentViewerDialog";

interface DocumentExecuterTableProps {
  queryResult: DocumentExecuterResult[] | null;
  collection?: string;
}

const DocumentExecuterTable: React.FC<DocumentExecuterTableProps> = ({
  queryResult,
  collection = "",
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentModalData | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDocument, setViewDocument] =
    useState<DocumentModalData | null>(null);

  const handleOpenModal = (documentId: string, documentData: unknown) => {
    setSelectedDocument({
      documentId,
      documentData: documentData as Record<string, unknown>,
      collection,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDocument(null);
  };

  const handleOpenViewModal = (documentId: string, documentData: unknown) => {
    setViewDocument({
      documentId,
      documentData: documentData as Record<string, unknown>,
      collection,
    });
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewDocument(null);
  };

  const handleOnSaveDocument = (
    documentId: string,
    updatedData: Record<string, unknown>
  ) => {
    window.ipcRenderer.send("document-save", {
      documentId,
      updatedData,
      collection,
      documentExecuterInputs: window.documentExecuter1Input,
    });
  };

  if (!queryResult) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="body2">
          Document 1 results will appear here once executed.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
        <Table aria-label="Couchbase documents table" size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#14161a" : "#f6f8fa",
              }}
            >
              <TableCell sx={{ width: 140, fontWeight: 700 }}>Actions</TableCell>
              <TableCell align="left" sx={{ width: 220, fontWeight: 700 }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 700 }}>
                Document Preview
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResult.map((row) => (
              <TableRow
                key={row.meta.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <ButtonGroup
                    variant="contained"
                    size="small"
                    aria-label="Document actions"
                  >
                    <Tooltip title="View JSON (Ctrl+F supported)">
                      <Button
                        color="primary"
                        onClick={() => {
                          handleOpenViewModal(row.meta.id, row.data);
                        }}
                        sx={{ px: 1 }}
                      >
                        <FaEye />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit Document">
                      <Button
                        color="inherit"
                        onClick={() => {
                          handleOpenModal(row.meta.id, row.data);
                        }}
                        sx={{ px: 1 }}
                      >
                        <FaPencil />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Document">
                      <Button disabled sx={{ px: 1 }}>
                        <FaRegTrashAlt />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {row.meta.id}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "text.secondary",
                    maxWidth: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {JSON.stringify(row.data)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DocumentViewerDialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        selectedDocument={viewDocument}
        onEditClick={() => {
          if (viewDocument) {
            handleOpenModal(viewDocument.documentId, viewDocument.documentData);
            handleCloseViewModal();
          }
        }}
      />

      <DocumentEditorDialog
        open={modalOpen}
        onClose={handleCloseModal}
        selectedDocument={selectedDocument}
        onSave={handleOnSaveDocument}
      />
    </>
  );
};

export default DocumentExecuterTable;
