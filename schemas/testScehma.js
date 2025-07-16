const mongoose = require("mongoose");

const testScehma = new mongoose.Schema({
    testDate: {
        type: Date,         
        required: true
    },
    testName: String,
    numOfQues : {
        type : Number,
        required : true
    },
    correctAnswers : {
        type : [Number],
        required : true
    },
    yourAns : {
        type : [Number],
        required : true
    },
    numOfCorrectAns : Number,
    numOfIncoreectAns : Number,
    numOfSkippedQues : Number,
    totalMarksObtain : Number,
    totalMarks : Number,
})

const Neet = mongoose.model("Neet", testScehma);

module.exports = Neet;