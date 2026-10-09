import React from "react";
import { Alert, Box, CircularProgress, Collapse } from "@mui/material";

interface SystemMessageAlertProps {
  message: string;
  onClose?: () => void;
}

export const SystemMessageAlert: React.FC<SystemMessageAlertProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  const isPending =
    message.includes("Checking") ||
    message.includes("Executing") ||
    message.includes("Saving");

  let severity: "success" | "error" | "info" | "warning" = "info";

  const lower = message.toLowerCase();
  if (lower.includes("fail") || lower.includes("error")) {
    severity = "error";
  } else if (
    lower.includes("success") ||
    lower.includes("reloaded")
  ) {
    severity = "success";
  } else if (lower.includes("connect the database")) {
    severity = "warning";
  }

  return (
    <Collapse in={Boolean(message)}>
      <Box sx={{ my: 1 }}>
        <Alert
          severity={severity}
          variant="outlined"
          onClose={onClose}
          icon={
            isPending ? (
              <CircularProgress size={16} color="inherit" thickness={5} />
            ) : undefined
          }
          sx={{
            py: 0.25,
            px: 1.5,
            fontSize: "13px",
            alignItems: "center",
            "& .MuiAlert-icon": {
              py: 0,
              mr: 1,
            },
            "& .MuiAlert-message": {
              py: 0.25,
            },
          }}
        >
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default SystemMessageAlert;
