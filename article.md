We know that a file as binary data can be saved in different DBMS system like
MySQL,MSSQL,Oracle. Today we will explore how a file can be uploaded in mongodb.
Their are two ways one is BSON data type in which size need to be less than 16
kb.

BSON is a binary serialization format used to store documents and make remote
procedure calls in MongoDB


Lets first create a express application using express generator.

express --view=ejs express-mongoose-bson


Now install required dependencies

By package.json look like

{
  "name": "express-mongoose-bson",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.4.5",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "mongoose": "^8.3.3",
    "morgan": "~1.9.1",
    "multer": "^1.4.5-lts.1"
  }
}


Here we are installing multer,dotenv,mongoose packages.

Run npm i.

create .env file in root folder with content

MONGO_URI = mongodb://sangram:sangram%2381@127.0.0.1:27017/phenixDb?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.2.3


Now add upload.js in root folder.

content of upload.js'

var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/profile_pic/')
  },
  filename: function (req, file, cb) {
    var fileparts = file.originalname.split(".");
    var ext = fileparts[fileparts.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  }
});

var upload = multer({ storage: storage });

module.exports = upload;

also add connection.js in root folder with following content.

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI,{ });

module.exports = mongoose;


create models folder in root location & add image.js in it.

Here is content of image.js

var mongoose = require("mongoose");
var connection = require("../connection");

var imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  filename: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});
var imageModel = new mongoose.model("Image", imageSchema);

module.exports = {
  ImageModel: imageModel,
  ImageSchema: imageSchema,
};


Now add uploads folder in public folder & inside uploads folder add profile_pic folder.

Now create demo.js inside rotes folder with follwoing content.

var express = require("express");
var router = express.Router();
var { ImageModel } = require("../models/image");
var upload = require("../upload");
var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");

router.post("/", upload.single("image"), async (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    filename: req.file.filename,
    img: {
      data: fs.readFileSync(
        path.join("./public/uploads/profile_pic/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  try {
    var item = await ImageModel.create(obj);
    res.json({ item: item });
  } catch (exp) {
    console.log(exp.message.toString());
    res.status(500).send({ msg: "An error occurred", error: exp });
  }
});

//get image --var mongoose = require("mongoose");
router.get("/:fileId", async (req, res) => {
  try {
    var result = await ImageModel.find(
      { _id: new mongoose.Types.ObjectId(req.params.fileId) },
      {}
    );
    var fileName = result[0].filename;
    var mimeType = result[0].img.contentType;
    var buffer = result[0].img.data;

    res.contentType(mimeType);
    res.send(buffer);
    
  } catch (err) {
    res
      .status(500)
      .send({ msg: "An error occurred", error: err.message.toString() });
  }
});

module.exports = router;

Inside app.js add 

var demoRouter = require('./routes/demo');

and 

app.use('/demo', demoRouter);

in suitable location.

Now we are ready to run our application.Usually testing can be done using
postman.



For uploading image

Here is curl for that
curl --location 'localhost:3000/demo' \
--form 'name="sangram"' \
--form 'desc="sangram desai"' \
--form 'image=@"/home/sangram/Pictures/Photo.jpg"'

Output:
{
  "item": {
    "name": "sangram",
    "desc": "sangram desai",
    "filename": "image-1714460945726.jpg",
    "img": {
      "data": {
        "type": "Buffer",
        "data": [some data here truncated]
      }
    },
    "_id": "6630991140528fe1e6bfa8d4",
    "__v": 0
  }
}

Downloading File:

curl --location 'http://localhost:3000/demo/6630991140528fe1e6bfa8d4'

Here we are passing it of record created in previous curl call.