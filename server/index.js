const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();
app.use(cors());
app.use(express.json());

const db = monk('localhost/meower');
const mews = db.get('mews');

app.get('/mews', (request, response) => {
  mews.find().then((mews) => {
    response.json(mews);
  });
});

function isValidMew(mew) {
  return (
    mew.name &&
    mew.name.toString().trim() !== '' &&
    mew.content &&
    mew.content.toString().trim() !== ''
  );
}

app.get('/', (request, response) => {
  response.json({
    message: 'Meower 😹',
  });
});

app.post('/mews', (request, response) => {
  if (isValidMew(request.body)) {
    const mew = {
      name: request.body.name.toString(),
      content: request.body.content.toString(),
      created: new Date(),
    };
    mews.insert(mew).then((createdMew) => {
      response.json(createdMew);
    });
  } else {
    response.status(422);
    res.json({
      message: 'Hey! Name and Content are required!',
    });
  }
});

app.listen(5000, () => {
  console.log('Listening on port http://localhost:5000');
});
