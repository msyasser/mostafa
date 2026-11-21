import { ImageResponse } from "next/og";

// The picture shown when a certificate link is shared (LinkedIn "Add media", posts, WhatsApp...):
// the credential, who it was issued to, the course, the date and the code. It asks the platform the same question
// as the verify page and never shows more than that page does.
export const alt = "Verified credential";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge"; // fonts are loaded with new URL(..., import.meta.url), which works on the edge runtime

const API_BASE = (process.env.COURSE_API_BASE || "https://api.mostafayasser.com").replace(/\/$/, "");
const CODE_RE = /^MY-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
const GOLD = "#D7B180";

async function lookup(code) {
  if (!CODE_RE.test(code)) return null;
  try {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(code)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = await res.json();
    return d && d.valid ? d : null;
  } catch {
    return null;
  }
}

// The certificate picture the app uploaded (the real certificate), as a data URL; null when it was not uploaded yet.
async function certificatePicture(code) {
  if (!CODE_RE.test(code)) return null;
  try {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(code)}/image`, { cache: "no-store" });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x2000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x2000));
    return `data:image/png;base64,${btoa(bin)}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();
  const picture = await certificatePicture(code);
  if (picture) {
    // The whole certificate (1754 x 1240) fitted into 1200 x 630 on the dark brand background.
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0C0B0A 0%, #1a130e 100%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture} width={792} height={560} alt="" style={{ borderRadius: 6, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }} />
        </div>
      ),
      { ...size },
    );
  }
  const [bold, medium, cert] = await Promise.all([
    fetch(new URL("./Tajawal-ExtraBold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./Tajawal-Medium.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    lookup(code),
  ]);

  const credential = cert ? (cert.credential ? cert.credential.en : cert.courseTitle) : "Mostafa Yasser";
  const date = cert
    ? new Date(cert.issuedAt * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "56px 72px", background: "linear-gradient(135deg, #0C0B0A 0%, #1a130e 60%, #2a1c14 100%)", color: "#FAF7F2", fontFamily: "Tajawal",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", width: 64, height: 64, borderRadius: 16, background: GOLD, color: "#0C0B0A", fontSize: 34, fontWeight: 800, alignItems: "center", justifyContent: "center" }}>MY</div>
            <div style={{ display: "flex", marginLeft: 20, fontSize: 30, fontWeight: 800, letterSpacing: 2, color: GOLD }}>MOSTAFA YASSER</div>
          </div>
          {cert ? (
            <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", borderRadius: 999, border: `2px solid ${GOLD}`, color: GOLD, fontSize: 26, fontWeight: 800 }}>
              <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: GOLD, marginRight: 12 }} />
              {"Verified credential"}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: cert ? 84 : 72, fontWeight: 800, lineHeight: 1.1, color: "#FAF7F2" }}>{credential}</div>
          {cert ? (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
              <div style={{ display: "flex", fontSize: 28, color: "#b9ab9b", fontWeight: 500 }}>Issued to</div>
              <div style={{ display: "flex", fontSize: 54, fontWeight: 800, color: GOLD, marginTop: 4 }}>{cert.name}</div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", fontSize: 26, color: "#d8cdbd", fontWeight: 500 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {cert ? (
              <div style={{ display: "flex", alignItems: "center", color: "#b9ab9b" }}>
                <div style={{ display: "flex" }}>{cert.courseTitle}</div>
                <div style={{ display: "flex", width: 8, height: 8, borderRadius: 4, background: GOLD, margin: "0 18px" }} />
                <div style={{ display: "flex" }}>{date}</div>
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: GOLD, fontWeight: 800, letterSpacing: 1 }}>{cert ? code : "mostafayasser.com"}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tajawal", data: bold, weight: 800, style: "normal" },
        { name: "Tajawal", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
