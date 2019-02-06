const { exec } = require('child_process')
const fs = require("fs")
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())

const AWS = require('aws-sdk');

const s3 = new AWS.S3(awsCreds);
const cloudfront = new AWS.CloudFront(awsCreds);

fs.readFile('index.html', (err, data) => {
   if (err) throw err;
   const params = {
       Bucket: 'xdai.io', // pass your bucket name
       Key: 'login', // file will be saved as testBucket/contacts.csv
       ContentType: 'text/html',
       Body: data,
       ACL: 'public-read'
   };
   s3.upload(params, function(s3Err, data) {
       if (s3Err) throw s3Err
       console.log(`File uploaded successfully at ${data.Location}`)

       fs.readFile('src/index.js', (err, data) => {
          if (err) throw err;
          const params = {
              Bucket: 'xdai.io', // pass your bucket name
              Key: 'static/index.js', // file will be saved as testBucket/contacts.csv
              ContentType: 'text/javascript',
              Body: data,
              ACL: 'public-read'
          };
          s3.upload(params, function(s3Err, data) {
              if (s3Err) throw s3Err
              console.log(`File uploaded successfully at ${data.Location}`)
              var cfparams = {
                DistributionId: "E3CMN5REPPRQFO",
                InvalidationBatch: {
                  CallerReference: ''+(new Date()),
                  Paths: {
                    Quantity: 2,
                    Items: ["/login","/static/index.js"]
                  }
                }
              };
              cloudfront.createInvalidation(cfparams, function(err, data) {
                console.log(err,data)
              });
          });
       });
   });
});
