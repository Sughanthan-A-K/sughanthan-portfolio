import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourcePath = path.join(rootDir, "public", "resume.html");
const docsDir = path.join(rootDir, "docs");
const targetPath = path.join(docsDir, "resume.html");

await mkdir(docsDir, { recursive: true });
await copyFile(sourcePath, targetPath);

console.log("Synced public/resume.html -> docs/resume.html");
