import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';


///Expressvalidator steps from 
//https://www.digitalocean.com/community/tutorials/how-to-handle-form-inputs-efficiently-with-express-validator-in-express-js
//https://medium.com/free-code-camp/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7
//https://howtodevez.medium.com/using-express-validator-for-data-validation-in-nodejs-6946afd9d67e
const router = express.Router();
const expressValidator = require('express-validator')

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // save uploaded files in `public/images` folder
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop(); // get file extension
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
    cb(null, uniqueFilename);
  }
});
const upload = multer({ storage: storage });

// Prisma setup
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


//------------------------------------

// Get all copics
router.get('/all', async (req, res) => { 
  const copics = await prisma.copic.findMany();

  res.json(copics);
});



// Get a copic by id
router.get('/get/:id', async (req, res) => {
  const id = req.params.id;

  // Validate id
  if(isNaN(id)){
    res.status(400).send('Invalid request id.');
    return;
  }

  const copic = await prisma.copic.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if(copic){
    res.json(copic);
  } else {
    res.status(404).send('Copic not found.');
  }  
});





// Add a new copic
router.post('/create', upload.single('image'),[
  body('colorName').isAlpha().withMessage('Invalid color name.'),
  body('colorCode').isAlphanumeric().withMessage('Invalid color code.'),  ///validation using express-validator
  body('type').isString().withMessage('Invalid type.'),
  body('number').isInt().withMessage('Number must be an integer.'),
  handleValidationErrors], 
  async (req, res) => {
  const { colorName, colorCode, type, number} = req.body;  
  const filename = req.file ? req.file.filename : null;
  
  // Validate inputs
  if(!colorName || !colorCode || !type || !number) { //check if not empty
    

    res.status(400).send('Required fields must have a value.');
    return;
  }


  const copic = await prisma.copic.create({
    data: {
      colorName: colorName,
      colorCode: colorCode,
      type: type,
      number: parseInt(number),
      filename: filename,
    }
  });

  res.status(200).json({ message: 'Copic created successfully.', copic });
});





// Update a copic by id
router.put('/update/:id', upload.single('image'),[
  body('colorName').optional().isAlpha().withMessage('Invalid color name.'),
  body('colorCode').optional().isAlphanumeric().withMessage('Invalid color code.'),
  body('type').optional().isString().withMessage('Invalid type.'),
  body('number').optional().isInt().withMessage('Number must be an integer.'),
  handleValidationErrors
], async(req, res) => {
  const id = req.params.id;

 // capture the inputs
  const { colorName, colorCode, type, number } = req.body;
  const filename = req.file ? req.file.filename : null;

 // validate the id
  if(isNaN(id)){
  res.status(400).send('Invalid request id.');
  return;
  }

 // validate required fields

 if (!colorName || !colorCode || !type || !number) {
  res.status(400).send('Required fields must have a value.');
  return;
  }

 // Find the copic by id (if not found, return 404)

 const currentCopic = await prisma.copic.findUnique({
  where: {
    id: parseInt(id),
  },
  });

  if(currentCopic){
    res.json(copic);
  } else {
    res.status(404).send('Copic not found.');
  } 
 

 // Update the database record with prisma (saving either the old or new filename)
 const copic = await prisma.copic.update({
  where: { id },
  data: {
    colorName: colorName || currentCopic.colorName,
    colorCode: colorCode || currentCopic.colorCode,
    type: type || currentCopic.type,
    number: number !== undefined ? parseInt(number) : currentCopic.number,
    filename: filename || currentCopic.filename, // Keep old filename if no new file is uploaded
    }
  });
 

  res.status(200).json({ message: 'Copic updated successfully.', updatedCopic });
});






// Delete a copic by id
router.delete('/delete/:id', async(req, res) => {
  const id = req.params.id;

  // verify id is a number
  if(isNaN(id)){
    res.status(400).send('Invalid request id.');
    return;
    }

  // Find the copic by id (if not found, return 404)

  const copic = await prisma.copic.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if(copic){
    res.json(copic);
  } else {
    res.status(404).send('Copic not found.');
  } 

  // delete the record with prisma
  await prisma.copic.delete({
    where: { id },
  });


  ////TO DO
  // delete the file (if the copic had one has one)

  res.status(200).json({ message: 'Copic deleted successfully.' });
});


export default router;