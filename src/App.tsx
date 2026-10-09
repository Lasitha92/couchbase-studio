import { Box } from "@mui/material";
import ConnectionCreator from "./components/ConnectionCreator";
import ExecuterTabs from "./components/ExecuterTabs";
import AppHeader from "./components/AppHeader";
import SystemMessageAlert from "./components/SystemMessageAlert";
import { useEffect, useState } from "react";

function App() {
  const [systemMessage, setSystemMessage] = useState<string>("");

  useEffect(() => {
    const handleSystemMessageUpdate = () => {
      const message = window.systemMessage;
      if (message !== undefined) {
        setSystemMessage(message);
      }
    };

    window.addEventListener("system-message-updated", handleSystemMessageUpdate);

    return () => {
      window.removeEventListener(
        "system-message-updated",
        handleSystemMessageUpdate
      );
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <ConnectionCreator />
        <SystemMessageAlert
          message={systemMessage}
          onClose={() => setSystemMessage("")}
        />
        <ExecuterTabs />
      </Box>
    </Box>
  );
}

export default App;
