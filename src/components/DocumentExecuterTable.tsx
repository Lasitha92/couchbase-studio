import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import JsonView from "@uiw/react-json-view";

interface DocumentExecuterTableProps {
  queryResult: DocumentExecuterResult[] | null;
  collection?: string;
}

interface DocumentModalData {
  documentId: string;
  documentData: unknown;
  collection: string;
}

const DocumentExecuterTable: React.FC<DocumentExecuterTableProps> = ({
  queryResult,
  collection = "",
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentModalData | null>(null);

  const handleOpenModal = (documentId: string, documentData: unknown) => {
    setSelectedDocument({
      documentId,
      documentData,
      collection,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDocument(null);
  };

  if (!queryResult) {
    return <div>This is executer 1. Your result will be displayed here</div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">DOCUMENT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResult.map((row) => (
              <TableRow
                key={row.meta.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <Button
                      onClick={() => {
                        handleOpenModal(row.meta.id, row.data);
                      }}
                    >
                      <FaPencil />
                    </Button>
                    <Button>
                      <FaRegTrashAlt />{" "}
                    </Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell align="left">{row.meta.id}</TableCell>
                <TableCell align="left">
                  {JSON.stringify(row.data).slice(0, 300)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Document Data Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "80vh",
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
          {selectedDocument && (
            <Box sx={{ mt: 2 }}>
              <JsonView
                value={selectedDocument.documentData as object}
                displayDataTypes={false}
                style={{ backgroundColor: "transparent" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentExecuterTable;
