import { Box, Typography } from "@mui/material";
import ConnectionCreator from "./components/ConnectionCreator";
import ExecuterTabs from "./components/ExecuterTabs";

function App() {
  return (
    <Box padding={1}>
      <ConnectionCreator />
      <Box padding={1}>
        <Typography color="textDisabled">System message</Typography>
      </Box>
      <ExecuterTabs />
    </Box>
  );
}

export default App;
