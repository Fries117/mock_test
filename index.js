const express = require("express");
const fs = require("fs");
var cors = require("cors");
const app = express();
const port = 3000;

/*
/register(name, rgb_frame, feature_vector) return id
/recognise(rgb_frame)
/history() return id, name, frame <---this is array
/people() return id, name, frame <---this is array 
*/
const buffer = fs.readFileSync("test.png");
const base64 = buffer.toString("base64");

var history = [];
var people = { 1: { name: "Firas", frame: base64, feature_vector: [] } };

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  let id = Date.now();
  people[id] = {
    name: req.body.name,
    frame: req.body.frame,
    feature_vector: req.body.feature_vector,
  };
  res.json({ id });
});

app.post("/recognise", (req, res) => {
  console.log(req.body);
  history.push({ id: 1, frame: req.body.frame });
  res.json({ result: true });
});

app.get("/history", (req, res) => {
  res.json({
    history: history.map((entry) => {
      const person = people[entry.id];
      return {
        id: entry.id,
        name: person.name,
        current_frame: entry.frame,
        stored_frame: person.frame,
      };
    }),
  });
});

app.get("/people", (req, res) => {
  res.json({ people });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
