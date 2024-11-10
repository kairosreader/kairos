const dbUrl = Deno.env.get("DATABASE_URL")!;
const url = new URL(dbUrl);

try {
  const conn = await Deno.connect({
    hostname: url.hostname,
    port: parseInt(url.port || "5432"),
  });
  conn.close();
  console.log("Database connection successful");
  Deno.exit(0);
} catch (error) {
  console.error("Database connection failed:", error);
  Deno.exit(1);
}
