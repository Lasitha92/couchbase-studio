import { Button, Grid, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FaPlug } from "react-icons/fa";

function ConnectionCreator() {
  const [formData, setFormData] = useState({
    serverUrl: "",
    username: "",
    password: "",
    bucketName: "",
    scopeName: "",
  });

  useEffect(() => {
    const handleAppConfigUpdated = () => {
      const config = window.appConfig;
      if (config) {
        setFormData({
          serverUrl: config.serverUrl,
          username: config.username,
          password: config.password,
          bucketName: config.bucketName,
          scopeName: config.scopeName,
        });
      }
    };
    window.addEventListener("app-config-updated", handleAppConfigUpdated);
    return () => {
      window.removeEventListener("app-config-updated", handleAppConfigUpdated);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConnect = () => {
    window.ipcRenderer.send("connect-to-couchbase", formData);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        mb: 1.5,
      }}
    >
      <Grid container spacing={1.5} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2.2 }}>
          <TextField
            id="serverUrl"
            size="small"
            fullWidth
            required
            label="Server URL"
            variant="outlined"
            value={formData.serverUrl}
            onChange={(e) => handleInputChange("serverUrl", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            id="username"
            size="small"
            fullWidth
            required
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            id="password"
            size="small"
            fullWidth
            required
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            id="bucket-name"
            size="small"
            fullWidth
            required
            label="Bucket Name"
            variant="outlined"
            value={formData.bucketName}
            onChange={(e) => handleInputChange("bucketName", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            id="scope-name"
            size="small"
            fullWidth
            required
            label="Scope Name"
            variant="outlined"
            value={formData.scopeName}
            onChange={(e) => handleInputChange("scopeName", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.8 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FaPlug />}
            onClick={handleConnect}
            sx={{
              height: "40px",
              fontWeight: 600,
            }}
          >
            Connect
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ConnectionCreator;
