import { Box, Typography } from "@mui/material";
import ConnectionCreator from "./components/ConnectionCreator";
import ExecuterTabs from "./components/ExecuterTabs";
import { useEffect, useState } from "react";

function App() {

  const [systemMessage, setSystemMessage] = useState<string>("");

  useEffect(() => {
    const handleSystemMessageUpdate = () => {
      const message = window.systemMessage;
      if (message) {
        setSystemMessage(message);
      }
    };

    window.addEventListener("system-message-updated", handleSystemMessageUpdate);

    return () => {
      window.removeEventListener("system-message-updated", handleSystemMessageUpdate);
    };
  }, []);

  return (
    <Box padding={1}>
      <ConnectionCreator />
      <Box padding={1}>
        <Typography color="textDisabled">{systemMessage}</Typography>
      </Box>
      <ExecuterTabs />
    </Box>
  );
}

export default App;
