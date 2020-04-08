const router = require("express").Router();
const Busboy = require("busboy");
const AWS = require("aws-sdk");

require("dotenv").config();

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    Bucket: process.env.BUCKET_NAME,
  });
  s3bucket.createBucket(function () {
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.name,
      Body: file.data,
    };
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log("error in callback");
        console.log(err);
      }
      console.log("success");
      console.log(data);
    });
  });
}

// Format: POST /api/files/upload
// Required Fields: file
// Returns: 200 if successful upload to S3 bucket, upload info in console.log
router.route("/upload").post((req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("finish", function () {
    console.log("Upload Finished");

    const file = req.files.file;
    uploadToS3(file);
  });
  req.pipe(busboy);
  return res.status(200).json("Upload Successful.").send();
});

module.exports = router;
