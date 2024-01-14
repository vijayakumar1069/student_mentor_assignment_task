const mentor=require('./mentor.js')

const mongoose = require("mongoose");
const studentschema = new mongoose.Schema({
  name: String,
  pMentor: [{ type: mongoose.Types.ObjectId, ref: "mentor" }],
  cMentor: { type: mongoose.Types.ObjectId, ref: "mentor" },
});

const student = mongoose.model("student", studentschema);

module.exports = student;