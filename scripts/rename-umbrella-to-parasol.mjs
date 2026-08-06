// One-off: rewrite English "Umbrella(s)" → "Parasol(s)" inside the persisted
// site-data.json on Cloudinary. Touches category/subcategory name_en and
// desc_en fields. Albanian text is untouched.
//
// Run:  node scripts/rename-umbrella-to-parasol.mjs
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

// Preserve case: Umbrellas → Parasols, Umbrella → Parasol, and lowercase forms
function rewrite(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/Umbrellas/g, "Parasols")
    .replace(/Umbrella/g, "Parasol")
    .replace(/umbrellas/g, "parasols")
    .replace(/umbrella/g, "parasol");
}

async function main() {
  const info = await cloudinary.api.resource(PUBLIC_ID, { resource_type: "raw" });
  const url = `${info.secure_url}?v=${info.version}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();

  const changes = [];
  const patchFields = (obj, fields, label) => {
    for (const f of fields) {
      const before = obj[f];
      const after = rewrite(before);
      if (before !== after) {
        obj[f] = after;
        changes.push(`${label}.${f}: "${before}" → "${after}"`);
      }
    }
  };

  for (const cat of data.categories ?? []) {
    patchFields(cat, ["name_en", "desc_en"], `category "${cat.id}"`);
  }
  for (const sub of data.subcategories ?? []) {
    patchFields(sub, ["name_en", "desc_en"], `subcategory "${sub.id}"`);
  }

  if (changes.length === 0) {
    console.log("No changes needed — data already uses Parasol(s).");
    return;
  }
  console.log("Applied changes:");
  for (const c of changes) console.log("  •", c);

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
  console.log(`✓ Wrote updated site-data.json to Cloudinary (${changes.length} changes)`);
}

main().catch((err) => {
  console.error("✗ Failed:", err);
  process.exit(1);
});
