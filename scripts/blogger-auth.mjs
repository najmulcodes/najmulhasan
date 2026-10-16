// One-time OAuth helper: prints a refresh token for the Blogger API.
// Run: node --env-file=.env.local scripts/blogger-auth.mjs
import http from "node:http";

const { BLOGGER_CLIENT_ID: id, BLOGGER_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Set BLOGGER_CLIENT_ID and BLOGGER_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const PORT = 8765;
const REDIRECT = `http://127.0.0.1:${PORT}`;
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: id,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/blogger",
    access_type: "offline",
    prompt: "consent", // forces Google to issue a refresh token
  });

const server = http.createServer(async (req, res) => {
  const code = new URL(req.url, REDIRECT).searchParams.get("code");
  if (!code) {
    res.end("No code in request.");
    return;
  }
  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: id,
        client_secret: secret,
        redirect_uri: REDIRECT,
        grant_type: "authorization_code",
      }),
    });
    const data = await r.json();
    if (!data.refresh_token) throw new Error(JSON.stringify(data));
    res.end("Done. Return to the terminal.");
    console.log("\nBLOGGER_REFRESH_TOKEN=" + data.refresh_token + "\n");
  } catch (e) {
    res.end("Failed. See the terminal.");
    console.error(e);
  } finally {
    server.close();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Open this URL in your browser and approve access:\n\n" + authUrl + "\n");
});
