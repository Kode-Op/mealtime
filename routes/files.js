const router = require("express").Router();
const AWS = require("aws-sdk");

require("dotenv").config();

// gather s3 information from env file
let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  Bucket: process.env.BUCKET_NAME,
});

// Format: POST /api/files/upload
// Required Fields: file, path (path format: subfolder/filename.txt) *only for images
// Returns: location and success if successful, error if not
router.route("/upload").post((req, res) => {
  const file = req.files.file;

  s3bucket.createBucket(function () {
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.path,
      Body: file.data,
      ContentType: "image",
      //ACL: "public-read",
    };

    s3bucket.putObject(params, function (err, data) {
      if (err) {
        return res
          .status(400)
          .json("Error: " + err)
          .send();
      }
      let response = {
        success: true,
        location: process.env.BUCKET_URL + params.Key,
      };
      return res.status(200).json(response).send();
    });
  });
});

module.exports = router;
