const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: '*' }));

const multer = require("multer");
const path = require("path");
const Joi = require('joi');
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://aaronnw:aaronaaron@cluster0.ppamwfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("Couldn't connect to mongodb", error));

const graduateSchema = new mongoose.Schema({
  name: String,
  classification: String,
  major: String,
  awards: String,
  latinHonors: String,
  img_name: String, 
});

async function createMessage() {
  const result = await message.save();
  console.log(result);
}

let graduates = [
  {
    "_id": 1,
    "name": "Imani Johnson",
    "classification": "Senior",
    "major": "Biology",
    "awards": "Dean's List, Spelman Research Scholar",
    "latinHonors": "Summa Cum Laude",
    "img_name": "/images/graduate1.jpg"
  },
  {
    "_id": 2,
    "name": "Chloe Smith",
    "classification": "Senior",
    "major": "Computer Science",
    "awards": "Google Scholar, Hackathon Winner",
    "latinHonors": "Magna Cum Laude",
    "img_name": "/images/graduate2.jpg"
  },
  {
    "_id": 3,
    "name": "Aaliyah Davis",
    "classification": "Senior",
    "major": "Economics",
    "awards": "National Merit Scholar",
    "latinHonors": "Cum Laude",
    "img_name": "/images/graduate3.jpg"
  },
  {
    "_id": 4,
    "name": "Jada Brown",
    "classification": "Senior",
    "major": "Political Science",
    "awards": "Spelman Leadership Award",
    "latinHonors": "Cum Laude",
    "img_name": "/images/graduate4.jpg"
  },
  {
    "_id": 5,
    "name": "Kayla Moore",
    "classification": "Senior",
    "major": "Mathematics",
    "awards": "STEM Scholar",
    "latinHonors": "Magna Cum Laude",
    "img_name": "/images/graduate5.jpg"
  },
  {
    "_id": 6,
    "name": "Zuri Taylor",
    "classification": "Senior",
    "major": "Art History",
    "awards": "Creative Excellence Grant",
    "latinHonors": "Cum Laude",
    "img_name": "/images/graduate6.jpg"
  },
  {
    "_id": 7,
    "name": "Morgan Lee",
    "classification": "Senior",
    "major": "Psychology",
    "awards": "Community Impact Award",
    "latinHonors": "Summa Cum Laude",
    "img_name": "/images/graduate7.jpg"
  },
  {
    "_id": 8,
    "name": "Amara Green",
    "classification": "Senior",
    "major": "English",
    "awards": "Writing Award, Dean's List",
    "latinHonors": "Magna Cum Laude",
    "img_name": "/images/graduate8.jpg"
  }
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

const Graduate = mongoose.model("Graduate", graduateSchema);

app.get("/api/graduates", async (req, res) => {
    const graduates = await Graduate.find();
    res.send(graduates);
});

app.get("/api/graduates/:id", async (req, res) => {
    const graduate = await Graduate.findOne({_id: id });
    res.send(graduate);
});

app.post("/api/graduates", upload.single("image"), async (req, res) => {
  const { error, value } = validateGraduate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  graduates.push(newGraduate);
  res.status(200).send(newGraduate);

  const graduate = new Graduate({
    name: req.body.name,
    classification: req.body.classification,
    major: req.body.major,
    awards: req.body.awards,
    latinHonors: req.body.latinHonors,
    img_name: req.file ? `/images/${req.file.filename}` : "/images/defaultgrad.jpg"
  });

  if (req.file) {
  graduate.img_name = `/images/${req.file.filename}`;
  }

  const newGraduate = await graduate.save();
  res.send(newGraduate);
});

app.put("/api/graduates/:id", upload.single("image"), async (req, res) => {
  const result = validateGraduate(req.body);

  const { error, value } = validateGraduate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let fieldsToUpdate = {
    name: req.body.name,
    classification: req.body.classification,
    major: req.body.major,
    awards: req.body.awards,
    latinHonors: req.body.latinHonors,
  };

  if (req.file) {
    fieldsToUpdate.img_name = `/images/${req.file.filename}`;
  }

  const wentThrough = await Graduate.updateOne(
    { _id: req.params.id },
    fieldsToUpdate
  );

  const updatedGraduate = await Graduate.findOne({ _id: req.params.id });
  res.send(updatedGraduate);
  });

  app.delete("/api/graduates/:id", async (req, res) => {
  const graduate = await Graduate.findByIdAndDelete(req.params.id);
  res.send(graduate);
  });

  const validateGraduate = (graduate) => {
    const schema = Joi.object({
      _id: Joi.allow(""),
      name: Joi.string().min(3).required(),
      classification: Joi.string().required(),
      major: Joi.string().required(),
      awards: Joi.string().required(),
      latinHonors: Joi.string().required(),
      img_name: Joi.string().required(),
    });

  return schema.validate(graduate);
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
