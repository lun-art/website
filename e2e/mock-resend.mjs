// Stand-in for Resend's API during e2e runs. The Worker posts emails
// (RESEND_API_URL) and contacts (RESEND_CONTACTS_URL) here; tests read them
// back from GET /emails and GET /contacts.
import { createServer } from "node:http";

const store = { "/emails": [], "/contacts": [] };
const port = Number(process.env.MOCK_RESEND_PORT ?? 4010);

createServer((req, res) => {
  const items = store[req.url];
  if (req.method === "POST" && items) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      items.push({ auth: req.headers.authorization, ...JSON.parse(body) });
      res
        .writeHead(200, { "content-type": "application/json" })
        .end('{"id":"mock"}');
    });
    return;
  }
  if (req.method === "GET" && items) {
    res
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify(items));
    return;
  }
  res.writeHead(req.url === "/" ? 200 : 404).end();
}).listen(port, "127.0.0.1");
