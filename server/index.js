const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const Filter = require('bad-words');

const app = express();
app.use(cors());
app.use(express.json());

const db = monk(process.env.MOGNO_URI || 'localhost/meower');
const mews = db.get('mews');

const filter = new Filter();

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

app.use(
  rateLimit({
    windowMs: 30 * 1000, // every 30 seconds
    max: 1, // limit each ip to 100 requests per windowMs
  })
);

app.get('/', (request, response) => {
  response.json({
    message: 'Meower 😹',
  });
});

app.post('/mews', (request, response) => {
  if (isValidMew(request.body)) {
    const mew = {
      name: filter.clean(request.body.name.toString()),
      content: filter.clean(request.body.content.toString()),
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
