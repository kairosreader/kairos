// Provide Deno-like environment for Node.
// This is required for the Drizzle Studio container to work since 
// it runs on Node but drizzle.config.ts uses Deno.env.
globalThis.Deno = {
  env: {
    get: (key) => process.env[key]
  }
};

// Re-export the config
module.exports = require('./drizzle.config.ts').default;
