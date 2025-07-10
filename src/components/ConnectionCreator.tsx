import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

function ConnectionCreator() {
  const [formData, setFormData] = useState({
    serverUrl: "",
    username: "",
    password: "",
    bucketName: "",
    scopeName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConnect = () => {
    // Send IPC call with form data
    window.ipcRenderer.send("connect-to-couchbase", formData);
  };

  return (
    <Grid container spacing={2} padding={1}>
      <Grid size={2}>
        <TextField
          id="serverUrl"
          required
          label="Server URL"
          variant="outlined"
          value={formData.serverUrl}
          onChange={(e) => handleInputChange("serverUrl", e.target.value)}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          id="username"
          required
          label="Username"
          variant="outlined"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          id="password"
          required
          label="Password"
          variant="outlined"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          id="bucket-name"
          required
          label="Bucket Name"
          variant="outlined"
          value={formData.bucketName}
          onChange={(e) => handleInputChange("bucketName", e.target.value)}
        />
      </Grid>
      <Grid size={2}>
        <TextField
          id="scope-name"
          required
          label="Scope Name"
          variant="outlined"
          value={formData.scopeName}
          onChange={(e) => handleInputChange("scopeName", e.target.value)}
        />
      </Grid>
      <Grid size={2} padding={1}>
        <Button variant="contained" onClick={handleConnect}>
          Connect
        </Button>
      </Grid>
    </Grid>
  );
}

export default ConnectionCreator;
