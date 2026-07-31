import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "logo.svg");
const outputDir = path.join(root, "public", "icon");
const sizes = [16, 32, 48, 96, 128];

await mkdir(outputDir, { recursive: true });

await Promise.all(
  sizes.map((size) =>
    sharp(source)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `${size}.png`)),
  ),
);

