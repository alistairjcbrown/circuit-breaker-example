const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/my-endpoint', function (req, res) {
  setTimeout(function () {
    res.send({ hello: "World" });
  }, Math.random() * 4000)
});

app.listen(4000, () => console.log('Example app listening on port 4000!'))
