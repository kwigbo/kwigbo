#!/bin/bash

# Default values of arguments
DEPLOY_PROD=0

# Loop through arguments and process them
for arg in "$@"
do
    case $arg in
        -p|--production)
        DEPLOY_PROD=1
        shift
        ;;
    esac
done

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp error.html build
cp manifest.json build

cp -r favicon build

cp -r GameSDK build
cp -r MainScene build
cp -r SproutLands build
cp -r Veve build

cd build

if [ $DEPLOY_PROD -eq 1 ]
then
   echo "Push to Production"
   aws s3 sync s3://kwigbo-stage s3://kwigbo --delete
   aws cloudfront create-invalidation --distribution-id ETU79Z47QN0GQ --paths "/*"
else
   echo "Push to Stage"
   aws s3 sync . s3://kwigbo-stage --delete
fi
