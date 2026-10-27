import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const SCRYPT_PREFIX = "scrypt$";

// Hashes are stored as "scrypt$<salt>$<hash>". Accounts created before this
// existed still hold an unsalted SHA-256 hex digest; verifyPassword accepts
// those so users can log in once and get upgraded (see needsRehash).
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return `${SCRYPT_PREFIX}${salt}$${derived.toString("hex")}`;
}

function safeEqualHex(a, b) {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string" || !stored) {
    return false;
  }

  if (stored.startsWith(SCRYPT_PREFIX)) {
    const [, salt, hash] = stored.split("$");
    if (!salt || !hash) return false;
    const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
    return safeEqualHex(derived.toString("hex"), hash);
  }

  // Legacy unsalted SHA-256
  const legacy = crypto.createHash("sha256").update(password).digest("hex");
  return /^[0-9a-f]{64}$/i.test(stored) && safeEqualHex(legacy, stored);
}

export function needsRehash(stored) {
  return typeof stored === "string" && !stored.startsWith(SCRYPT_PREFIX);
}

// Works on either a Notion database schema's `properties` or a page's
// `properties`: both expose `.type` per property.
export function findPasswordPropertyName(properties) {
  const names = Object.keys(properties || {});
  const isText = (n) => properties[n]?.type === "rich_text" || properties[n]?.type === "text";
  return (
    names.find((n) => n.toLowerCase().includes("password") && isText(n)) ||
    names.find(isText)
  );
}
