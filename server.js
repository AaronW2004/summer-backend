const express = require("express");
const app = express();
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const Joi = require('joi');

app.use(cors({ origin: '*' }));
app.use(express.static("public"));
app.use(express.json());

let graduates = [ /* your existing data */ ];

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

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/api/graduates", (req, res) => res.json(graduates));

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
