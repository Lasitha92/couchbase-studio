export class CouchbaseConnector {
  private constructor() {}

  public static async isConnectionValid(): Promise<boolean> {
    const connectionString = process.env["SERVER_URL"];
    const username = process.env["USERNAME"];
    const password = process.env["PASSWORD"];
    const bucketName = process.env["BUCKET_NAME"];
    const scopeName = process.env["SCOPE_NAMES"];

    try {
      const response = await fetch(
        `http://${connectionString}:8093/query/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
          body: JSON.stringify({
            statement: `SELECT * FROM system:scopes WHERE bucket_name = "${bucketName}" AND name = "${scopeName}";`,
          }),
        }
      );

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error connecting to Couchbase:", error);
      return false;
    }
  }

  public static async executeQuery(query: string): Promise<unknown> {
    const connectionString = process.env["SERVER_URL"];
    const username = process.env["USERNAME"];
    const password = process.env["PASSWORD"];
    const bucketName = process.env["BUCKET_NAME"];
    const scopeName = process.env["SCOPE_NAME"];

    console.log("Executing query:", query);

    try {
      const response = await fetch(
        `http://${connectionString}:8093/query/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
          body: JSON.stringify({
            statement: query,
            query_context: `default:${bucketName}.${scopeName}`,
          }),
        }
      );

      if (!response.ok) {
        console.error(response);
        throw new Error(`Query failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}
