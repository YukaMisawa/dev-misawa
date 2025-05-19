
const express = require('express');
const app = express();
const port = 4783;

app.get('/', (req, res) => {
  res.send('Ciao!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});