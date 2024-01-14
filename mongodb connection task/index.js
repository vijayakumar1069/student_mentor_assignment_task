const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const student = require("./models/student.js");
const mentor = require("./models/mentor.js");

const app = express();
const port = 3000;
const db_url =
  "mongodb+srv://vijay:vijay@cluster0.ka2lofn.mongodb.net/?retryWrites=true&w=majority";
app.use(bodyparser.json()); // IMPORTANT

//DB CONNECTION

mongoose
  .connect(db_url, {})
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => console.log(err));

//ADD A MENTOR

app.post("/addmentor", async (req, res) => {
  try {
    const newmentor = new mentor(req.body); //mentor is collection name
    await newmentor.save();
    res.status(200).send(newmentor);
  } catch (error) {
    res.status(500).send(error);
  }
});

//ADD A STUDENT

app.post("/addstudent", async (req, res) => {
  try {
    const newstudent = new student(req.body);
    await newstudent.save();
    res.status(200).send(newstudent);
  } catch (error) {
    res.status(500).send(error);
  }
});

//MENTOR ASSIGN STUDENTS

app.post("/mentor/:metorid/assign", async (req, res) => {
  const currentmentor = await mentor.findById(req.params.metorid);
  const students = await student.find({ _id: { $in: req.body.students } });
  students.forEach((student) => {
    student.cMentor = currentmentor._id;
    student.save();
  });
  currentmentor.students = [
    ...currentmentor.students,
    ...students.map((student) => student._id),
  ];
  await currentmentor.save();
  res.status(200).send(currentmentor);
});

//ASSIGN PARTICULAR MENTOR FOR PARTICULAR STUDENT

app.put("/student/:studentID/assign/mentor/:mentorID", async (req, res) => {
  const newmentor = await mentor.findById(req.params.mentorID);
  const currentstudent = await student.findById(req.params.studentID);
  if (currentstudent.cMentor) {
    currentstudent.pMentor.push(currentstudent.cMentor._id);
  }
  currentstudent.cMentor = newmentor._id;
  currentstudent.save();
  res.status(200).send(currentstudent.cMentor);
});

//GET ALL STUDENTS DETAILS FOR PARICULAR MENTOR

app.get("/mentor/:mentorId/students", async (req, res) => {
  try {
    const currentmentor = await mentor
      .findById(req.params.mentorId)
      .populate("students");

    res.status(200).send(currentmentor);
  } catch (error) {
    console.log(error);
  }
});

//GET PARICULAR STUDENT PREVIOUS MENTOR DETAILS

app.get("/student/:studentID/mentors", async (req, res) => {
  const currentstudent = await student
    .findById(req.params.studentID)
    .populate("pMentor");

  res.status(200).send(currentstudent.pMentor);
});

app.listen(port, () => {
  console.log("listening on port", port);
});