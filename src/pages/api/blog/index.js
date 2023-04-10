import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  
  
  if (req.method === 'GET') {
    // Read the existing data from the JSON file
    const jsonDirectory = path.join(process.cwd(), 'public/uploads');
    const cats = await fs.readFile(jsonDirectory + '/data.json', 'utf8');

const objectData = JSON.parse(cats);
  res.status(200).json(objectData.record);


  } else if (req.method === 'POST') {
  
    
  
  
  
  const form = formidable({
    multiples: true,
    keepExtensions: true
    
  });

  

  
        //res.status(200).json({title});

  form.parse(req, async (err, fields, files) => {
    
    
    
    
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }

    // Validate form fields
    const { title, description } = fields;
    
    if (!title || !/^[a-zA-Z0-9 ]{5,50}$/.test(title)) {
      return res.status(400).send('Ttle Minimum 5 characters || Maximum 50 characters||No special characters||Required field');
    }
    
    
    if (!description && description.length > 500) {
      res.status(400).send('Title and description are required fields || Maximum 500 characters');
      return;
    }

    // Validate uploaded images
    const { main_image, additional_images } = files;
    if (!main_image || !additional_images) {
      res.status(400).send('Two image files are required');
      return;
    }

    // Check file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1000000; // 1MB
    const images = [];
    var mainimage='';
    var subimage='';

    for (const [key, image] of Object.entries(files)) {

      //res.status(200).json(image.path);
     /* if (!allowedTypes.includes(image.type)) {
        res.status(400).send(`Only JPEG and PNG files are allowed for ${image.type}`);
        return;
      }*/

      if (image.size > maxSize) {
        res.status(400).send(`File size must be less than 1MB for ${key}`);
        return;
      }


      if(image.filepath) 
     {

    let oldfileName = image.filepath;
    let newFileName = './public/test'+Math.random()+'.jpeg';

   
    await fs.rename(oldfileName, newFileName, function(err) {
    if (err) {
     // res.status(400).send(`File size must be less than 1MB for ${err}`);
    console.log(err);
    return;
    }})
    

     
        images.push(newFileName);
}
    }


    const jsonDirectory = path.join(process.cwd(), 'public/uploads');
    const jsonData = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
    const objectData = JSON.parse(jsonData);

    objectData.record
    const newData = {
        "reference": Object.keys(objectData.record).length + 1,
        "title": title,
        "description":description,
        "main_image": images[0],
        "additional_images":images[1],
        "date_time": new Date().getTime()
        };
    
        objectData.record.push(newData);
        const updatedData = JSON.stringify(objectData); 
        await fs.writeFile(jsonDirectory + '/data.json', updatedData);
        
        res.status(200).json({ message: 'Images uploaded and saved successfully'});
    
         return;

    
    
  
  });


 

  
  

 
 

  
     
}
}
