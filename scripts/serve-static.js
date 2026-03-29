const http = require("http");
const fs = require("fs");
const path = require("path");

const rootArg = process.argv[2] || "demo";
const port = Number(process.argv[3] || 8080);
const rootDir = path.resolve(process.cwd(), rootArg);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json"
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function resolveRequestPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const candidate = path.resolve(rootDir, `.${normalized}`);

  if (!candidate.startsWith(rootDir)) {
    return null;
  }

  return candidate;
}

function readTarget(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    return path.join(targetPath, "index.html");
  }

  return targetPath;
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const resolved = resolveRequestPath(url.pathname === "/" ? "/index.html" : url.pathname);

    if (!resolved || !fs.existsSync(resolved)) {
      send(res, 404, "Not Found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const filePath = readTarget(resolved);
    if (!fs.existsSync(filePath)) {
      send(res, 404, "Not Found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const content = fs.readFileSync(filePath);
    send(res, 200, content, { "Content-Type": getContentType(filePath) });
  } catch (error) {
    send(res, 500, error.message, { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(port, () => {
  console.log(`Serving ${rootDir} at http://localhost:${port}`);
});
