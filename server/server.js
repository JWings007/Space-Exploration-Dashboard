const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/spaceDB", {
  useNewUrlParser: true,
});

// -----EMAIL SCHEMA FOR STORING USERS EMAIL IN DATABASE-----

const userMailSchema = new mongoose.Schema({
  email: {
    type: String,
  },
});

// -----MODEL OF TYPE USERMAIL SCHEMA-----


const List = mongoose.model("List", userMailSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => {
  console.log("Server started");
});

// -----IF THE GET NOTIFED BUTTON IS PRESSED POST REQUEST TRIGGERS AND THE 
//      DATA PRESENT IN THE INPUT FIELD IS RETRIWED AND INSERTED INTO DATABASE-----

app.post("/post", (req, res) => {
  List.create({ email: req.body.email });
  res.send({ action: true });
});

app.get("/:norad", (req, res) => {
  const id = req.params.norad;
  axios
    .get(
      `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${userData.lat}/${userData.lon}/0/300/&apiKey=${process.env.API_KEY}`
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});
