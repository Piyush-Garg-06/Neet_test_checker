const express = require("express");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const Neet = require("./schemas/testScehma.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

const main = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/neet");
}

main()
.then(()=>{
    console.log("Connection successful!!");
})
.catch((err)=>{
    console.log(err);
})



app.get("/newTest", (req, res) => {
    res.render("takeTest"); 
});



app.post("/submitTest", async (req, res) => {
  let { testDate, testName, numOfQues, correctAnswers, yourAnswers } = req.body;

  correctAnswers = correctAnswers.split(",").map(ans => Number(ans.trim()));
  yourAnswers = yourAnswers.split(",").map(ans => {
    let val = ans.trim();
    return val === "" ? null : Number(val);
  });

  let numOfCorrectAns = 0;
  let numOfSkippedQues = 0;
  let numOfIncoreectAns = 0;
  let totalMarksObtain = 0;

  for (let i = 0; i < correctAnswers.length; i++) {
    if (yourAnswers[i] == null) {
      numOfSkippedQues++;
    } else if (yourAnswers[i] === correctAnswers[i]) {
      numOfCorrectAns++;
      totalMarksObtain += 4;
    } else {
      numOfIncoreectAns++;
      totalMarksObtain -= 1;
    }
  }

  const newTest = new Neet({
    testName,
    testDate,
    numOfQues,
    correctAnswers,
    yourAns: yourAnswers,
    numOfCorrectAns,
    numOfIncoreectAns,
    numOfSkippedQues,
    totalMarksObtain,
    totalMarks: correctAnswers.length * 4
  });

  await newTest.save();
  res.redirect(`/results/${newTest._id}`);
});



app.get("/results/:id", async (req, res) => {
  const { id } = req.params;
  const test = await Neet.findById(id);
  if (!test) {
    return res.send("Test not found");
  }
  res.render("testSummary", { test });
});



app.get("/tests", async (req, res) => {
  const tests = await Neet.find().sort({ testDate: -1 });
  res.render("allTests", { tests });
});



app.get("/tests/:id", async (req, res) => {
  const test = await Neet.findById(req.params.id);
  res.render("testSummary", { test });
});


app.get("/marks", async (req, res) => {
  const tests = await Neet.find().sort({ testDate: -1 });
  res.render("marks", { tests });
});



app.get("/", (req, res)=>{
    res.render("home.ejs")
})



app.listen(8080, ()=>{
    console.log("Server listening at port 8080");
})