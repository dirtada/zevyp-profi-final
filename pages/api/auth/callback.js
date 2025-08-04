import { google } from "googleapis";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Chybí autorizační kód.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GCAL_CLIENT_ID,
    process.env.GCAL_CLIENT_SECRET,
    process.env.GCAL_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return res
      .status(200)
      .send(`<h1>Refresh token:</h1><pre>${tokens.refresh_token}</pre>`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Nepodařilo se získat token.");
  }
}
