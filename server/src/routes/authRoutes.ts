import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/hh-login', (req, res) => {
  const clientId = process.env.HH_CLIENT_ID;
  const redirectUri = 'https://job-tapper-frontend.ru.tuna.am/oauth/callback';
  const responseType = 'code';

  const authUrl = `https://hh.ru/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}`;
  res.redirect(authUrl);
});

export default router;