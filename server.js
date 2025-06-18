const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: '*' }));

const multer = require("multer");
const path = require("path");
const Joi = require('joi');

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

const validateGraduate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    classification: Joi.string().required(),
    major: Joi.string().required(),
    awards: Joi.string().allow(''),
    latinHonors: Joi.string().required()
  });

  return schema.validate(data);
};

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

app.get("/api/graduates", (req, res) => {
    res.json(graduates);
});

app.post("/api/graduates", upload.single("image"), (req, res) => {
  const { error, value } = validateGraduate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const newGraduate = {
    _id: graduates.length + 1,
    ...value,
    img_name: req.file ? `/images/${req.file.filename}` : "/images/defaultgrad.jpg"
  };

  graduates.push(newGraduate);
  res.status(200).send(newGraduate);
});

app.put("/api/graduates/:id", upload.single("image"), (req, res) => {
  let graduate = graduates.find((g) => g._id === parseInt(req.params.id));
  if (!graduate) return res.status(404).send("Graduate not found");

  const { error, value } = validateGraduate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Object.assign(graduate, value);
  if (req.file) {
    graduate.img_name = `/images/${req.file.filename}`;
  }

  res.send(graduate);
});

app.delete("/api/graduates/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = graduates.findIndex((g) => g._id === id);

  if (index === -1) return res.status(404).send("Graduate not found");

  const deleted = graduates.splice(index, 1);
  res.status(200).send(deleted[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
