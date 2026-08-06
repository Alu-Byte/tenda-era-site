// One-off recovery: restore the 3 subcategories that existed in Cloudinary
// before an admin-panel test wiped them. Also removes the "E-Test" junk row
// that was created during the same test.
//
// Run:  node scripts/recover-subcategories.mjs
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

// The 3 subcategories that were present before the test. These match the
// current defaults in src/lib/data.ts (post-parasol rename).
const RECOVERED_SUBS = [
  {
    id: "tenda-fikse",
    categoryId: "tenda",
    name_sq: "Tendë Fikse",
    name_en: "Fixed Awning",
    desc_sq: "Tendë e montuar në mënyrë permanente mbi fasadë ose tarracë.",
    desc_en: "Permanently mounted awning over a facade or terrace.",
    order: 2,
  },
  {
    id: "cadra-plazhi",
    categoryId: "cadra",
    name_sq: "Çadër Plazhi",
    name_en: "Beach Parasol",
    desc_sq: "Çadra të mëdha për plazhe dhe zona bregdetare.",
    desc_en: "Large parasols for beaches and coastal areas.",
    order: 1,
  },
  {
    id: "cadra-restoranti",
    categoryId: "cadra",
    name_sq: "Çadër Restoranti",
    name_en: "Restaurant Parasol",
    desc_sq: "Çadra komerciale për restorante, bare dhe kafene.",
    desc_en: "Commercial parasols for restaurants, bars and cafes.",
    order: 2,
  },
];

async function main() {
  const info = await cloudinary.api.resource(PUBLIC_ID, { resource_type: "raw" });
  const url = `${info.secure_url}?v=${info.version}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();

  console.log("Before subs:", data.subcategories);
  data.subcategories = RECOVERED_SUBS;
  console.log("After  subs count:", data.subcategories.length);

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
  console.log("✓ Recovered subcategories written to Cloudinary");
}

main().catch((err) => {
  console.error("✗ Failed:", err);
  process.exit(1);
});
