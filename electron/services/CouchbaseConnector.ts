export class CouchbaseConnector {
  private constructor() {}

  public static async isConnectionValid(): Promise<string[]> {
    const connectionString = process.env["SERVER_URL"];
    const username = process.env["USERNAME"];
    const password = process.env["PASSWORD"];
    const bucketName = process.env["BUCKET_NAME"];
    const scopeName = process.env["SCOPE_NAME"];

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
      console.error(response);
      throw new Error("Error connecting to the database");
    }

    // Scopes api has a https issue. This is a temporary workaround.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const collectionsResponse = await fetch(
      `https://${connectionString}/pools/default/buckets/${bucketName}/scopes`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      }
    );

    if (!collectionsResponse.ok) {
      throw new Error("Error connecting to the database");
    }

    const scopesResponse = await collectionsResponse.json();

    const scope = scopesResponse.scopes.filter(
      (scope: { name: string }) => scope.name === scopeName
    )[0];

    const collections = scope.collections.map(
      (scope: { name: string }) => scope.name
    );

    console.log("Available collections:", collections);
    return collections;
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
