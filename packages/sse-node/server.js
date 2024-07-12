const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:4200'
}))

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const interval = setInterval(() => {
    sendEvent({ time: new Date().toISOString() });
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});