import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

function createData(id: string, document: string) {
  return { id, document };
}

const rows = [
  createData(
    "62f670d7555d6960ba6506ad",
    '{"partnerId":"611e221743d58628169177c7","status":"ORDER_DISPATCHED","brandId":"611e23e943d58628169177ca","menuId":"611e2ba1d849ff3af46176ba","updatedAt":"2025-07-08T06:13:24.333Z","type":"DELIVERY","currencyCode":"AED","userId":null,"note":"","numberOfOrder":"KMZCZ","businessDay":null,"campaigns":null,"channel":null,"closedOnPosAppId":null,"customer":{"id":"685bb1c302d623d17e3d631a","name":"SalindaKarunarathna","email":"","phone":"+94712201315","landmarkHint":"","addressHint":"rr,rr","location":{"latitude":"25.180578","longitude":"55.271028"}},"delivery":{"location":{"latitude":"25.180578","longitude":"55.271028","address":"rr,rr","area":"","city":"","street":""},"notes":"rr","deliveryMode":"","receiverName":"SalindaKarunarathna","receiverMobileNumber":"+94712201315"},"fulfillmentType":"DELIVERY_BY_RESTAURANT","items":["62f670d7c29ead3903b54945"],"kitchenInfo":{"id":"611e24b343d58628169177cb","countryCode":"ARE","tax":{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT"}},"numberOfGuests":null,"originalOrderId":null,"payment":{"status":"UNPAID","taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"discounts":[],"invoiceNumber":"93","paymentSource":null,"receiptMode":"single","bills":[{"status":"UNPAID","authCode":null,"method":"CASH","otherCharges":null,"change":null,"loyalty":null,"cardType":null,"charges":{"taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"tips":null,"total":{"amount":11000,"currencyCode":"AED"},"deliveryFee":{"amount":600,"currencyCode":"AED"},"subTotal":{"amount":11000,"currencyCode":"AED"},"extraCharges":null},"online":{"amount":0,"currencyCode":"AED"},"invoiceId":null,"cash":{"amount":11600,"currencyCode":"AED"},"card":{"amount":0,"currencyCode":"AED"},"billItems":[{"part":"1.0","orderItem":"62f670d7c29ead3903b54945"}],"cardPaymentSource":null}]},"placedAt":"2025-07-08T06:13:24.229Z","registerId":null,"scheduledAt":null,"source":{"name":"ONLINE_ORDER","sourceId":"web-order","gtInternalId":"875399525473198080","displayName":"Onlineorder","createdAt":"2022-08-12T15:25:10.801Z","uniqueOrderId":"62f670d6555d6960ba6506ac"},"statusInfo":{"note":null,"reason":{"id":"","name":{"text":"","translations":[]}},"isPrepared":null},"sync":null,"tableInfo":null,"userClosedBy":null,"voidSequenceNumber":""}'
  ),
  createData(
    "62f670d7555d6960ba6506ad",
    '{"partnerId":"611e221743d58628169177c7","status":"ORDER_DISPATCHED","brandId":"611e23e943d58628169177ca","menuId":"611e2ba1d849ff3af46176ba","updatedAt":"2025-07-08T06:13:24.333Z","type":"DELIVERY","currencyCode":"AED","userId":null,"note":"","numberOfOrder":"KMZCZ","businessDay":null,"campaigns":null,"channel":null,"closedOnPosAppId":null,"customer":{"id":"685bb1c302d623d17e3d631a","name":"SalindaKarunarathna","email":"","phone":"+94712201315","landmarkHint":"","addressHint":"rr,rr","location":{"latitude":"25.180578","longitude":"55.271028"}},"delivery":{"location":{"latitude":"25.180578","longitude":"55.271028","address":"rr,rr","area":"","city":"","street":""},"notes":"rr","deliveryMode":"","receiverName":"SalindaKarunarathna","receiverMobileNumber":"+94712201315"},"fulfillmentType":"DELIVERY_BY_RESTAURANT","items":["62f670d7c29ead3903b54945"],"kitchenInfo":{"id":"611e24b343d58628169177cb","countryCode":"ARE","tax":{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT"}},"numberOfGuests":null,"originalOrderId":null,"payment":{"status":"UNPAID","taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"discounts":[],"invoiceNumber":"93","paymentSource":null,"receiptMode":"single","bills":[{"status":"UNPAID","authCode":null,"method":"CASH","otherCharges":null,"change":null,"loyalty":null,"cardType":null,"charges":{"taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"tips":null,"total":{"amount":11000,"currencyCode":"AED"},"deliveryFee":{"amount":600,"currencyCode":"AED"},"subTotal":{"amount":11000,"currencyCode":"AED"},"extraCharges":null},"online":{"amount":0,"currencyCode":"AED"},"invoiceId":null,"cash":{"amount":11600,"currencyCode":"AED"},"card":{"amount":0,"currencyCode":"AED"},"billItems":[{"part":"1.0","orderItem":"62f670d7c29ead3903b54945"}],"cardPaymentSource":null}]},"placedAt":"2025-07-08T06:13:24.229Z","registerId":null,"scheduledAt":null,"source":{"name":"ONLINE_ORDER","sourceId":"web-order","gtInternalId":"875399525473198080","displayName":"Onlineorder","createdAt":"2022-08-12T15:25:10.801Z","uniqueOrderId":"62f670d6555d6960ba6506ac"},"statusInfo":{"note":null,"reason":{"id":"","name":{"text":"","translations":[]}},"isPrepared":null},"sync":null,"tableInfo":null,"userClosedBy":null,"voidSequenceNumber":""}'
  ),
  createData(
    "62f670d7555d6960ba6506ad",
    '{"partnerId":"611e221743d58628169177c7","status":"ORDER_DISPATCHED","brandId":"611e23e943d58628169177ca","menuId":"611e2ba1d849ff3af46176ba","updatedAt":"2025-07-08T06:13:24.333Z","type":"DELIVERY","currencyCode":"AED","userId":null,"note":"","numberOfOrder":"KMZCZ","businessDay":null,"campaigns":null,"channel":null,"closedOnPosAppId":null,"customer":{"id":"685bb1c302d623d17e3d631a","name":"SalindaKarunarathna","email":"","phone":"+94712201315","landmarkHint":"","addressHint":"rr,rr","location":{"latitude":"25.180578","longitude":"55.271028"}},"delivery":{"location":{"latitude":"25.180578","longitude":"55.271028","address":"rr,rr","area":"","city":"","street":""},"notes":"rr","deliveryMode":"","receiverName":"SalindaKarunarathna","receiverMobileNumber":"+94712201315"},"fulfillmentType":"DELIVERY_BY_RESTAURANT","items":["62f670d7c29ead3903b54945"],"kitchenInfo":{"id":"611e24b343d58628169177cb","countryCode":"ARE","tax":{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT"}},"numberOfGuests":null,"originalOrderId":null,"payment":{"status":"UNPAID","taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"discounts":[],"invoiceNumber":"93","paymentSource":null,"receiptMode":"single","bills":[{"status":"UNPAID","authCode":null,"method":"CASH","otherCharges":null,"change":null,"loyalty":null,"cardType":null,"charges":{"taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"tips":null,"total":{"amount":11000,"currencyCode":"AED"},"deliveryFee":{"amount":600,"currencyCode":"AED"},"subTotal":{"amount":11000,"currencyCode":"AED"},"extraCharges":null},"online":{"amount":0,"currencyCode":"AED"},"invoiceId":null,"cash":{"amount":11600,"currencyCode":"AED"},"card":{"amount":0,"currencyCode":"AED"},"billItems":[{"part":"1.0","orderItem":"62f670d7c29ead3903b54945"}],"cardPaymentSource":null}]},"placedAt":"2025-07-08T06:13:24.229Z","registerId":null,"scheduledAt":null,"source":{"name":"ONLINE_ORDER","sourceId":"web-order","gtInternalId":"875399525473198080","displayName":"Onlineorder","createdAt":"2022-08-12T15:25:10.801Z","uniqueOrderId":"62f670d6555d6960ba6506ac"},"statusInfo":{"note":null,"reason":{"id":"","name":{"text":"","translations":[]}},"isPrepared":null},"sync":null,"tableInfo":null,"userClosedBy":null,"voidSequenceNumber":""}'
  ),
  createData(
    "62f670d7555d6960ba6506ad",
    '{"partnerId":"611e221743d58628169177c7","status":"ORDER_DISPATCHED","brandId":"611e23e943d58628169177ca","menuId":"611e2ba1d849ff3af46176ba","updatedAt":"2025-07-08T06:13:24.333Z","type":"DELIVERY","currencyCode":"AED","userId":null,"note":"","numberOfOrder":"KMZCZ","businessDay":null,"campaigns":null,"channel":null,"closedOnPosAppId":null,"customer":{"id":"685bb1c302d623d17e3d631a","name":"SalindaKarunarathna","email":"","phone":"+94712201315","landmarkHint":"","addressHint":"rr,rr","location":{"latitude":"25.180578","longitude":"55.271028"}},"delivery":{"location":{"latitude":"25.180578","longitude":"55.271028","address":"rr,rr","area":"","city":"","street":""},"notes":"rr","deliveryMode":"","receiverName":"SalindaKarunarathna","receiverMobileNumber":"+94712201315"},"fulfillmentType":"DELIVERY_BY_RESTAURANT","items":["62f670d7c29ead3903b54945"],"kitchenInfo":{"id":"611e24b343d58628169177cb","countryCode":"ARE","tax":{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT"}},"numberOfGuests":null,"originalOrderId":null,"payment":{"status":"UNPAID","taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"discounts":[],"invoiceNumber":"93","paymentSource":null,"receiptMode":"single","bills":[{"status":"UNPAID","authCode":null,"method":"CASH","otherCharges":null,"change":null,"loyalty":null,"cardType":null,"charges":{"taxes":[{"sourceId":"5f7ac8508088545d96024088","code":"VAT","amount":5,"displayName":"VAT","value":552}],"tips":null,"total":{"amount":11000,"currencyCode":"AED"},"deliveryFee":{"amount":600,"currencyCode":"AED"},"subTotal":{"amount":11000,"currencyCode":"AED"},"extraCharges":null},"online":{"amount":0,"currencyCode":"AED"},"invoiceId":null,"cash":{"amount":11600,"currencyCode":"AED"},"card":{"amount":0,"currencyCode":"AED"},"billItems":[{"part":"1.0","orderItem":"62f670d7c29ead3903b54945"}],"cardPaymentSource":null}]},"placedAt":"2025-07-08T06:13:24.229Z","registerId":null,"scheduledAt":null,"source":{"name":"ONLINE_ORDER","sourceId":"web-order","gtInternalId":"875399525473198080","displayName":"Onlineorder","createdAt":"2022-08-12T15:25:10.801Z","uniqueOrderId":"62f670d6555d6960ba6506ac"},"statusInfo":{"note":null,"reason":{"id":"","name":{"text":"","translations":[]}},"isPrepared":null},"sync":null,"tableInfo":null,"userClosedBy":null,"voidSequenceNumber":""}'
  ),
];

const DocumentExecuter1: React.FC = () => {
  const [queryResult, setQueryResult] = useState<unknown>(
    () => window.query1Result
  );

  const [inputs, setInputs] = useState(
    () => window.documentExecuter1Input || null
  );

  const [collections, setCollections] = useState<string[]>(
    () => window.collections || []
  );

  const [selectedCollection, setSelectedCollection] = useState<string>("");

  useEffect(() => {
    const handleMessageUpdate = () => {
      const message = window.query1Result;
      if (message) {
        setQueryResult(message);
      }
    };

    const handleCollectionsUpdate = () => {
      const collections = window.collections || [];
      if (collections.length > 0) {
        setCollections(collections);
        setSelectedCollection(collections[0]);
      }
    };

    window.addEventListener("document-result-1-updated", handleMessageUpdate);
    window.addEventListener(
      "available-collections-updated",
      handleCollectionsUpdate
    );

    setInputs(null);
    console.log(queryResult);

    return () => {
      window.removeEventListener(
        "document-result-1-updated",
        handleMessageUpdate
      );
      window.removeEventListener(
        "available-collections-updated",
        handleCollectionsUpdate
      );
    };
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Autocomplete
            options={collections}
            id="collection-selector"
            disableClearable
            value={selectedCollection}
            onChange={(_event, newValue) => {
              setSelectedCollection(newValue || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Collection" variant="outlined" />
            )}
          />
        </Grid>
        <Grid size={3}>
          <TextField
            label="Document ID"
            variant="outlined"
            fullWidth
          ></TextField>
        </Grid>
        <Grid size={5}>
          <TextField
            label="Where clause"
            variant="outlined"
            fullWidth
          ></TextField>
        </Grid>
        <Grid size={1}>
          <TextField
            label="Limit"
            variant="outlined"
            fullWidth
            type="number"
          ></TextField>
        </Grid>
      </Grid>
      <Box
        component="pre"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => window.ipcRenderer.send("document-1-execute", inputs)}
        >
          Execute
        </Button>
      </Box>

      <Box
        component="pre"
        sx={{
          bgcolor: "grey.200",
          width: "100%",
          minHeight: "300px",
          display: "flex",
          alignItems: "left",
        }}
      >
        {rows ? (
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
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
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
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">
                      {row.document.slice(0, 300)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          "This is executer 1. Your result will be displayed here"
        )}
      </Box>
    </>
  );
};

export default DocumentExecuter1;
