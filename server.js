const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: '*'
}));


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
    "img_name": "../images/graduate8.jpg"
  }
];

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/graduates", (req, res) => {
    res.json(graduates);
});

app.post("api/graduates", (req, res) => {
  const graduate = {
    name: req.body.name,
    classification: req.body.classification,
    major: req.body.major,
    awards: req.body.awards,
    latinHonors: req.body.latinHonors,
    img_name: req.file.filename
  };
  graduates.push(graduate);
  res.json(graduates);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
