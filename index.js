import express from "express";
import { createBareServer } from "@tomphttp/bare-server-node";

const app = express();
const fq = createBareServer("/fq/v1/");

// Simple request queue
let activeRequests = 0;
const MAX_CONCURRENT = 20; // tweak this depending on upstream limits

app.use(async (req, res, next) => {
  if (!fq.shouldRoute(req)) return next();

  if (activeRequests >= MAX_CONCURRENT) {
    return res.status(429).json({
      code: "TOO_MANY_CONNECTIONS",
      message: "Server busy, try again shortly",
    });
  }

  activeRequests++;
  try {
    await fq.routeRequest(req, res);
  } finally {
    activeRequests--;
  }
});

app.use((req, res) => {
  res.status(404).end("Not Bare");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Bare running on port ${PORT}`));
