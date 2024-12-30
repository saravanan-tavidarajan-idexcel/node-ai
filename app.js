const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 9000;
let genAI = require('./genAI');
// Define a simple route
app.get('/', (req, res) => {
    console.log('recienved request');
  res.send('Hello World!');
});




// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });


// Define a simple route
app.post('/prompt', upload.single('file'),async(req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const prompt = "scan all the data from the xlsx and return as json object";
    const pdffile = {
        inlineData: {
          data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
          mimeType: req.file.mimetype,
        },
    };
    try {
      const result = await genAI.model.generateContent([prompt, pdffile]);
      let jsonText = result.response.text().replace(/```json/g, "").replace(/```/g, "");
      res.send(jsonText, 200);
    } catch (error) {
      //req.send("Error", 500) 
      console.log(error);
    }
});
