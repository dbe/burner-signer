const { exec } = require('child_process')
const fs = require("fs")
const aws = require('aws-sdk');

const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())
const s3 = new aws.S3(awsCreds);
const cloudfront = new aws.CloudFront(awsCreds);

//TODO: Make everything configurable
const BUCKET = 'xdai.io'
// const BUCKET = 'buffidai.io'

const files = [
  {source: 'index.html', key: 'loginV2', type: 'text/html'},
  {source: 'dist/index.js', key: 'static/indexV2.js', type: 'text/javascript'},
  {source: 'dist/xdai.css', key: 'static/xdai.css', type: 'text/css'},
  // {source: 'dist/buffidai.css', key: 'static/buffidai.css', type: 'text/css'},
  {source: 'dist/whiteburn.png', key: 'static/whiteburn.png', type: 'image/png'},
]

//Upload all files
files.map(file => uploadFile(file));

//Invalidate cache
const cfparams = {
  DistributionId: "E3CMN5REPPRQFO", //xdai.io
  // DistributionId: "EO4J1L211YU2O", //burnerwallet.io
  // DistributionId: "E3UXHQH85ACKYA", //buffidai.io
  InvalidationBatch: {
    CallerReference: ''+(new Date()),
    Paths: {
      Quantity: files.length,
      Items: files.map(file => `/${file.key}`)
    }
  }
};

console.log('cfparams: ', cfparams);
console.log('cfparams.InvalidationBatch.Paths.Items: ', cfparams.InvalidationBatch.Paths.Items);

cloudfront.createInvalidation(cfparams, function(err, data) {
  if(err) throw err;
  console.log('data: ', data);
  console.log("Cloud front successfully invalidated")
});

function uploadFile(spec) {
  console.log('Uploading file: ', spec);

  fs.readFile(spec.source, (err, data) => {
    if (err) throw err;
    const params = {
       Bucket: BUCKET, // pass your bucket name
       Key: spec.key, // file will be saved as testBucket/contacts.csv
       ContentType: spec.type,
       Body: data,
       ACL: 'public-read'
    };

     s3.upload(params, function(s3Err, data) {
       if (s3Err) throw s3Err;
       console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
}
