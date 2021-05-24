const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.json({
    message: 'Meower 😹',
  });
});

app.listen(5000, () => {
  console.log('Listening on port http://localhost:5000');
});
