import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

try {
    const content = readFileSync(".env.local", "utf8")
        .replace(/\r\n/g, "\n");

    writeFileSync(".env.clean", content, "utf8");

    execSync(
        "sops -e --input-type dotenv --output-type dotenv .env.clean > env.encrypted",
        {
            stdio: "inherit",
            shell: true
        }
    );

    unlinkSync(".env.clean");
    console.log("✅ Variable de entorno .env.local encriptada en env.encrypted");
} catch (error) {
    console.error("❌ Error encriptando .env.local");
    console.error(error.message);
    process.exit(1);
}