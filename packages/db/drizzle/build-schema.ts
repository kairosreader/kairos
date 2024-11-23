import { build } from "npm:esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(__dirname, "schema", "mod.ts")],
  outfile: join(__dirname, "schema.cjs"),
  format: "cjs",
  platform: "node",
  bundle: true,
  packages: "external",
  alias: {
    "@kairos/shared/constants": join(
      __dirname,
      "../../shared/constants/mod.ts",
    ),
    "@kairos/shared/utils": join(__dirname, "../../shared/utils/mod.ts"),
    "@kairos/shared/types": join(__dirname, "../../shared/types/mod.ts")
  },
});
