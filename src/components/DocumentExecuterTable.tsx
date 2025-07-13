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
} from "@mui/material";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import DocumentEditorDialog, {
  DocumentModalData,
} from "./DocumentEditorDialog";

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
                    <Button disabled >
                      <FaRegTrashAlt />
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
