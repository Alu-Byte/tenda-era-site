// One-time migration: upload every file in public/uploads/ to Cloudinary,
// rewrite URLs in data/site-data.json, then write the result to Cloudinary
// as the source-of-truth site-data.json.
//
// Reads credentials from .env.local. Skips images already uploaded (by public_id).
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const envPath = path.join(process.cwd(), ".env.local");
const env = fs.readFileSync(envPath, "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
  if (m && !m[1].startsWith("#")) process.env[m[1]] = m[2];
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const DATA_FILE = path.join(process.cwd(), "data", "site-data.json");
const SITE_DATA_PUBLIC_ID = "tenda-era/site-data";

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
console.log(`Loaded site-data.json — ${data.images?.length ?? 0} image records`);

// Map filename -> new cloudinary URL after upload
const newUrlByFilename = new Map();

function uploadOne(filePath, publicId, ext) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tenda-era/uploads",
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        format: ext.replace(/^\./, ""),
      },
      (err, res) => {
        if (err) {
          // 409 == already exists; treat as success and fetch its URL
          if (err.http_code === 409 || /already exists/i.test(err.message ?? "")) {
            return cloudinary.api.resource(`tenda-era/uploads/${publicId}`, { resource_type: "image" })
              .then((info) => resolve(info.secure_url))
              .catch(reject);
          }
          return reject(err);
        }
        resolve(res.secure_url);
      }
    );
    fs.createReadStream(filePath).pipe(stream);
  });
}

// Iterate over the images in site-data.json (not the folder) so we only
// upload photos that are actually referenced.
let uploaded = 0, skipped = 0, failed = 0;
for (const img of data.images ?? []) {
  const url = img.url ?? "";
  if (!url.startsWith("/uploads/")) { skipped++; continue; }
  const filename = path.basename(url);
  const ext = path.extname(filename).toLowerCase();
  const id = filename.replace(ext, "");
  const filePath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠  file missing on disk: ${filename}`);
    failed++;
    continue;
  }
  try {
    process.stdout.write(`  → uploading ${filename} ... `);
    const newUrl = await uploadOne(filePath, id, ext);
    newUrlByFilename.set(filename, newUrl);
    img.url = newUrl;
    console.log("ok");
    uploaded++;
  } catch (err) {
    console.log("FAILED");
    console.error("     ", err.message);
    failed++;
  }
}

// Also patch subcategory coverImage URLs
for (const sub of data.subcategories ?? []) {
  if (sub.coverImage?.startsWith("/uploads/")) {
    const filename = path.basename(sub.coverImage);
    const newUrl = newUrlByFilename.get(filename);
    if (newUrl) sub.coverImage = newUrl;
  }
}

console.log(`\nImages: uploaded=${uploaded}, skipped=${skipped}, failed=${failed}`);

// Now upload site-data.json as a raw resource
console.log("Writing site-data.json to Cloudinary ...");
const buf = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      public_id: SITE_DATA_PUBLIC_ID,
      resource_type: "raw",
      overwrite: true,
      invalidate: true,
    },
    (err, res) => (err ? reject(err) : resolve(res))
  );
  stream.end(buf);
});
console.log("✔ site-data.json uploaded to Cloudinary");

// Also write the updated JSON back to disk so the repo reflects Cloudinary URLs
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
console.log("✔ local data/site-data.json updated with Cloudinary URLs");
