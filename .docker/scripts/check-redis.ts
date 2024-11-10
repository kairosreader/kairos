const redisHost = Deno.env.get("REDIS_HOST") || "localhost";
const redisPort = parseInt(Deno.env.get("REDIS_PORT") || "6379");

try {
  const conn = await Deno.connect({
    hostname: redisHost,
    port: redisPort,
  });
  conn.close();
  console.log("Redis connection successful");
  Deno.exit(0);
} catch (error) {
  console.error("Redis connection failed:", error);
  Deno.exit(1);
}
