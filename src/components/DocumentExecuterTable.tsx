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
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

interface DocumentExecuterTableProps {
  queryResult: DocumentExecuterResult[] | null;
}

const DocumentExecuterTable: React.FC<DocumentExecuterTableProps> = ({
  queryResult,
}) => {
  if (!queryResult) {
    return <div>This is executer 1. Your result will be displayed here</div>;
  }

  return (
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
                  <Button>
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
  );
};

export default DocumentExecuterTable;
