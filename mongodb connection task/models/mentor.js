const student=require('./student.js')

const mongoose = require("mongoose");

const mentorschema = new mongoose.Schema({
  name: String,
  students: [{ type: mongoose.Types.ObjectId, ref: "student" }],
});
const mentor = mongoose.model("mentor", mentorschema);

module.exports = mentor;