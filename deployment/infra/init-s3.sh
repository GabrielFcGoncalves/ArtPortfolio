#!/bin/bash
echo "=== Creating S3 Bucket ==="
awslocal s3 mb s3://porfordio-assets

echo "=== Configuring CORS for S3 Bucket ==="
awslocal s3api put-bucket-cors --bucket porfordio-assets --cors-configuration '{"CORSRules":[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","POST","DELETE","HEAD"],"AllowedOrigins":["*"],"ExposeHeaders":["ETag"]}]}'