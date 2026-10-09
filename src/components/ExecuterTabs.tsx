import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { FaFolderOpen, FaTerminal } from "react-icons/fa";
import QueryExecuter1 from "./QueryExecuter1";
import QueryExecuter2 from "./QueryExecuter2";
import QueryExecuter3 from "./QueryExecuter3";
import DocumentExecuter from "./DocumentExecuter";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ExecuterTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#14161a" : "#f6f8fa",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Couchbase Studio Executer Tabs"
          sx={{
            minHeight: "44px",
            "& .MuiTab-root": {
              minHeight: "44px",
              py: 1,
              px: 2,
              gap: 1,
            },
          }}
        >
          <Tab
            icon={<FaFolderOpen size={14} />}
            iconPosition="start"
            label="Document 1"
            {...a11yProps(0)}
          />
          <Tab
            icon={<FaTerminal size={12} />}
            iconPosition="start"
            label="Query 1"
            {...a11yProps(1)}
          />
          <Tab
            icon={<FaTerminal size={12} />}
            iconPosition="start"
            label="Query 2"
            {...a11yProps(2)}
          />
          <Tab
            icon={<FaTerminal size={12} />}
            iconPosition="start"
            label="Query 3"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DocumentExecuter />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QueryExecuter1 />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <QueryExecuter2 />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <QueryExecuter3 />
      </TabPanel>
    </Paper>
  );
};

export default ExecuterTabs;
