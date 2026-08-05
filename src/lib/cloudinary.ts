import { v2 as cloudinary } from "cloudinary";

export function isCloudinary(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

let configured = false;
function ensureConfig() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function cldClient() {
  ensureConfig();
  return cloudinary;
}

// Upload an image buffer. The public_id is derived from the image `id` so we
// can delete by id later. Returns the delivery URL.
export function uploadImageToCloudinary(
  buffer: Buffer,
  id: string,
  ext: string
): Promise<string> {
  ensureConfig();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "tenda-era/uploads",
        public_id: id,
        resource_type: "image",
        overwrite: false,
        // Cloudinary picks the format from the bytes, but we hint via format
        // to keep the delivery URL extension in sync with what we processed.
        format: ext.replace(/^\./, ""),
      },
      (err, res) => {
        if (err || !res) return reject(err ?? new Error("Cloudinary upload returned no result"));
        resolve(res.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(url: string): Promise<void> {
  ensureConfig();
  const publicId = publicIdFromUrl(url);
  if (!publicId) throw new Error(`Cannot derive Cloudinary public_id from url: ${url}`);
  await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}

// Derive a Cloudinary public_id from a delivery URL like
// https://res.cloudinary.com/<cloud>/image/upload/v1234/tenda-era/uploads/<id>.webp
function publicIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  return m ? m[1] : null;
}

// ── site-data.json as a Cloudinary "raw" resource ────────────
// We use a single fixed public_id and overwrite it on every write. Cloudinary
// serves the freshest bytes at res.cloudinary.com/<cloud>/raw/upload/... but
// its CDN caches by version, so we bust the URL with the `version` returned
// by the upload.
const SITE_DATA_PUBLIC_ID = "tenda-era/site-data";

export async function readSiteDataFromCloudinary(): Promise<unknown | null> {
  ensureConfig();
  try {
    const info = await cloudinary.api.resource(SITE_DATA_PUBLIC_ID, {
      resource_type: "raw",
    });
    // Fetch the raw JSON, busting CDN via the version number
    const url = `${info.secure_url}?v=${info.version}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    // 404 == "not uploaded yet"
    const e = err as { http_code?: number; error?: { http_code?: number } };
    if (e?.http_code === 404 || e?.error?.http_code === 404) return null;
    throw err;
  }
}

export async function writeSiteDataToCloudinary(data: unknown): Promise<void> {
  ensureConfig();
  const buf = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
  await new Promise<void>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: SITE_DATA_PUBLIC_ID,
        resource_type: "raw",
        overwrite: true,
        invalidate: true,
      },
      (err) => (err ? reject(err) : resolve())
    );
    stream.end(buf);
  });
}
