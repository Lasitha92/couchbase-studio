import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import QueryExecuter1 from "./QueryExecuter1";
import QueryExecuter2 from "./QueryExecuter2";
import QueryExecuter3 from "./QueryExecuter3";
import DocumentExecuter1 from "./documentExecuter1";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Document 1" {...a11yProps(0)} />
          <Tab label="Query 1" {...a11yProps(1)} />
          <Tab label="Query 2" {...a11yProps(2)} />
          <Tab label="Query 3" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DocumentExecuter1 />
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
    </Box>
  );
};

export default ExecuterTabs;
