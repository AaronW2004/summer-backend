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
  .then(() => {
    console.log("Connected to mongodb");
    seedDatabaseIfEmpty();
  })
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

async function seedDatabaseIfEmpty() {
  const count = await Graduate.countDocuments();
  if (count === 0) {
    const seedGraduates = [
      {
        name: "Imani Johnson",
        classification: "Senior",
        major: "Biology",
        awards: "Dean's List, Spelman Research Scholar",
        latinHonors: "Summa Cum Laude",
        img_name: "/images/graduate1.jpg"
      },
      {
        name: "Chloe Smith",
        classification: "Senior",
        major: "Computer Science",
        awards: "Google Scholar, Hackathon Winner",
        latinHonors: "Magna Cum Laude",
        img_name: "/images/graduate2.jpg"
      },
      {
        name: "Aaliyah Davis",
        classification: "Senior",
        major: "Economics",
        awards: "National Merit Scholar",
        latinHonors: "Cum Laude",
        img_name: "/images/graduate3.jpg"
      },
      {
        name: "Jada Brown",
        classification: "Senior",
        major: "Political Science",
        awards: "Spelman Leadership Award",
        latinHonors: "Cum Laude",
        img_name: "/images/graduate4.jpg"
      },
      {
        name: "Kayla Moore",
        classification: "Senior",
        major: "Mathematics",
        awards: "STEM Scholar",
        latinHonors: "Magna Cum Laude",
        img_name: "/images/graduate5.jpg"
      },
      {
        name: "Zuri Taylor",
        classification: "Senior",
        major: "Art History",
        awards: "Creative Excellence Grant",
        latinHonors: "Cum Laude",
        img_name: "/images/graduate6.jpg"
      },
      {
        name: "Morgan Lee",
        classification: "Senior",
        major: "Psychology",
        awards: "Community Impact Award",
        latinHonors: "Summa Cum Laude",
        img_name: "/images/graduate7.jpg"
      },
      {
        name: "Amara Green",
        classification: "Senior",
        major: "English",
        awards: "Writing Award, Dean's List",
        latinHonors: "Magna Cum Laude",
        img_name: "/images/graduate8.jpg"
      }
    ];
    await Graduate.insertMany(seedGraduates);
    console.log("MongoDB seeded with initial graduates");
  } else {
    console.log(" MongoDB already contains graduate data");
  }
}

app.get("/api/graduates", async (req, res) => {
  console.log("GET request");
    const graduates = await Graduate.find();
    res.send(graduates);
});

app.get("/api/graduates/:id", async (req, res) => {
  console.log("GET /api/graduates/:id route hit with ID:", req.params.id);
  try {
    const graduate = await Graduate.findOne({ _id: req.params.id });
    if (!graduate) return res.status(404).send("Graduate not found");
    res.send(graduate);
  } catch (err) {
    res.status(500).send("Invalid ID format");
  }
});


app.post("/api/graduates", upload.single("image"), (req, res) => {
  const { error, value } = validateGraduate(req.body, false);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const newGrad = new Graduate({
    ...value,
    img_name: req.file ? `/images/${req.file.filename}` : "/images/defaultgrad.jpg"
  });

  newGrad.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).json({ success: false, message: err.message }));
});


app.put("/api/graduates/:id", upload.single("image"), async (req, res) => {
  const { error, value } = validateGraduate(req.body, true);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const update = { ...value };
  if (req.file) update.img_name = `/images/${req.file.filename}`;

  try {
    const updated = await Graduate.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).send("Graduate not found");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

  app.delete("/api/graduates/:id", async (req, res) => {
  const graduate = await Graduate.findByIdAndDelete(req.params.id);
  res.send(graduate);
  });

  const validateGraduate = (body, isUpdate = false) => {
  const base = {
    name: Joi.string().min(3).required(),
    classification: Joi.string().required(),
    major: Joi.string().required(),
    awards: Joi.string().allow(''),
    latinHonors: Joi.string().required()
  };

  if (!isUpdate) {
    base.img_name = Joi.string().optional();
  }

  return Joi.object(base).validate(body);
};


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
