export class CouchbaseConnector {
  private constructor() {}

  public static async getInstance(): Promise<void> {
    console.log("Hi");

    const connectionString = process.env["SERVER_URL"];
    const username = process.env["USERNAME"];
    const password = process.env["PASSWORD"];
    const bucketName = process.env["BUCKET_NAME"];
    const scopeName = process.env["SCOPE_NAME"];

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
            statement: `SELECT META().id, o.* FROM \`${bucketName}\`.\`${scopeName}\`.orders as o Limit 5;`,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error connecting to Couchbase:", error);
    }
  }
}
