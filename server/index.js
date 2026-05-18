import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const distDir = join(rootDir, "dist");

loadEnvFile(join(rootDir, ".env.local"));
loadEnvFile(join(rootDir, ".env"));

const port = Number(process.env.PORT || 4174);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20000) {
        rejectBody(new Error("Payload too large"));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolveBody(JSON.parse(body || "{}"));
      } catch {
        rejectBody(new Error("Invalid JSON"));
      }
    });

    request.on("error", rejectBody);
  });
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function validateContactForm(payload) {
  const data = {
    fullName: cleanText(payload.fullName, 120),
    countryCode: cleanText(payload.countryCode, 8),
    phoneNumber: cleanText(payload.phoneNumber, 20).replace(/\D/g, ""),
    email: cleanText(payload.email, 160),
    purpose: cleanText(payload.purpose, 80),
    reason: cleanText(payload.reason, 3000),
  };

  const errors = [];
  if (data.fullName.length < 2) errors.push("Full name is required.");
  if (!data.countryCode) errors.push("Country code is required.");
  if (data.phoneNumber.length < 7 || data.phoneNumber.length > 15) errors.push("Phone number must be 7 to 15 digits.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("A valid email is required.");
  if (!data.purpose) errors.push("Purpose is required.");
  if (data.reason.length < 10) errors.push("Message must be at least 10 characters.");

  return { data, errors };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toPurposeLabel(value) {
  const labels = {
    "job-opportunity": "Job Opportunity",
    "freelance-project": "Freelance Project",
    collaboration: "Collaboration",
    "general-inquiry": "General Inquiry",
  };

  return labels[value] || value;
}

function buildEmailTemplate(data) {
  const rows = [
    ["Full Name", data.fullName],
    ["Email", data.email],
    ["Phone", `${data.countryCode} ${data.phoneNumber}`],
    ["Purpose", toPurposeLabel(data.purpose)],
  ];

  return `<!doctype html>
<html>
  <body style="margin:0;background:#0a0c10;color:#e2e8f0;font-family:'JetBrains Mono','Courier New',monospace;">
    <div style="max-width:720px;margin:0 auto;padding:28px;">
      <div style="border:1px solid #1e2535;border-radius:12px;background:#10141c;overflow:hidden;">
        <div style="padding:26px 28px;border-bottom:1px solid #1e2535;background:linear-gradient(135deg,rgba(124,58,237,.22),rgba(0,229,255,.12));">
          <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#00e5ff;">Portfolio Contact</div>
          <h1 style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:26px;line-height:1.2;color:#ffffff;">New Reach Out Form Submission</h1>
        </div>
        <div style="padding:24px 28px;">
          <div style="display:block;border-left:3px solid #10b981;background:#161b26;border-radius:8px;padding:18px;margin-bottom:22px;">
            ${rows
              .map(
                ([label, value]) => `
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">${escapeHtml(label)}</div>
              <div style="font-size:15px;color:#ffffff;">${escapeHtml(value)}</div>
            </div>`
              )
              .join("")}
          </div>
          <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:8px;">Message</div>
          <div style="border:1px solid #1e2535;border-radius:8px;background:#161b26;padding:16px;color:#e2e8f0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.reason)}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is missing.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE !== "false",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function toMailErrorMessage(error) {
  if (error?.code === "EAUTH" || error?.responseCode === 535) {
    return "SMTP authentication failed. Check SMTP_USER and SMTP_PASS in .env.";
  }

  if (error?.code === "ECONNECTION" || error?.code === "ETIMEDOUT" || error?.code === "ESOCKET") {
    return "Could not connect to the SMTP server. Check SMTP_HOST, SMTP_PORT, and your network.";
  }

  if (error?.responseCode) {
    return `SMTP server rejected the message (${error.responseCode}).`;
  }

  return "Unable to send message right now.";
}

async function handleContact(request, response) {
  try {
    const payload = await readJsonBody(request);
    const { data, errors } = validateContactForm(payload);

    if (errors.length > 0) {
      sendJson(response, 400, { message: errors[0] });
      return;
    }

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `Portfolio inquiry from ${data.fullName}`,
      text: [
        `Full Name: ${data.fullName}`,
        `Email: ${data.email}`,
        `Phone: ${data.countryCode} ${data.phoneNumber}`,
        `Purpose: ${toPurposeLabel(data.purpose)}`,
        "",
        data.reason,
      ].join("\n"),
      html: buildEmailTemplate(data),
    });

    sendJson(response, 200, { message: "Message sent successfully." });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { message: toMailErrorMessage(error) });
  }
}

function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(distDir, safePath);
  const resolvedFile = resolve(filePath);

  if (!resolvedFile.startsWith(distDir) || !existsSync(resolvedFile)) {
    const fallback = join(distDir, "index.html");
    if (existsSync(fallback)) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(readFileSync(fallback));
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Build not found. Run npm run build first.");
    return;
  }

  response.writeHead(200, { "Content-Type": mimeTypes[extname(resolvedFile)] || "application/octet-stream" });
  response.end(readFileSync(resolvedFile));
}

createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/contact") {
    handleContact(request, response);
    return;
  }

  serveStatic(request, response);
}).listen(port, () => {
  console.log(`Portfolio server running at http://localhost:${port}`);
});
