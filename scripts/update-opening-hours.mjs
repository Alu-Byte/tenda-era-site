// One-off: read site-data.json from Cloudinary, update the weekday opening
// hours, and write it back. Saturday stays 8:00–14:00 / 8am–2pm.
//
// Run:  node scripts/update-opening-hours.mjs
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

const PUBLIC_ID = "tenda-era/site-data";

const NEW_HOURS = {
  weekdays_sq: "E Hënë – E Premte, 8:00 – 16:00",
  weekdays_en: "Monday – Friday, 8:00 AM – 4:00 PM",
  saturday_sq: "E Shtunë, 8:00 – 14:00",
  saturday_en: "Saturday, 8:00 AM – 2:00 PM",
};

async function main() {
  const info = await cloudinary.api.resource(PUBLIC_ID, { resource_type: "raw" });
  const url = `${info.secure_url}?v=${info.version}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();

  const before = { ...(data.openingHours ?? {}) };
  data.openingHours = { ...(data.openingHours ?? {}), ...NEW_HOURS };
  console.log("Before:", before);
  console.log("After :", data.openingHours);

  const buf = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
  await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: PUBLIC_ID,
        resource_type: "raw",
        overwrite: true,
        invalidate: true,
      },
      (err) => (err ? reject(err) : resolve())
    );
    stream.end(buf);
  });
  console.log("✓ Wrote updated site-data.json to Cloudinary");
}

main().catch((err) => {
  console.error("✗ Failed:", err);
  process.exit(1);
});
