// Stand-in for Resend's API during e2e runs. The Worker posts emails here
// (RESEND_API_URL); tests read them back from GET /emails.
import { createServer } from "node:http";

const emails = [];
const port = Number(process.env.MOCK_RESEND_PORT ?? 4010);

createServer((req, res) => {
  if (req.method === "POST" && req.url === "/emails") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      emails.push({ auth: req.headers.authorization, ...JSON.parse(body) });
      res
        .writeHead(200, { "content-type": "application/json" })
        .end('{"id":"mock"}');
    });
    return;
  }
  if (req.method === "GET" && req.url === "/emails") {
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify(emails));
    return;
  }
  res.writeHead(req.url === "/" ? 200 : 404).end();
}).listen(port, "127.0.0.1");
