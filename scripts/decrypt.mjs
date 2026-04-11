import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

try {
    const output = execSync(
        "sops -d --input-type dotenv --output-type dotenv env.encrypted",
        { encoding: "utf8" }
    );

    writeFileSync(".env.local", output.replace(/\r\n/g, "\n"), "utf8");
    console.log("✅ Variable de entorno env.encrypted desencriptada en .env.local");
} catch (error) {
    console.error("❌ Error desencriptando env.encrypted");
    console.error(error.message);
    process.exit(1);
}