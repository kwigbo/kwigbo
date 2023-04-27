#!/bin/bash

# Default values of arguments
DEPLOY_PROD=0
DEPLOY_STAGE=0

# Loop through arguments and process them
for arg in "$@"
do
    case $arg in
        -p|--production)
        DEPLOY_PROD=1
        shift
        ;;
    esac
    case $arg in
        -s|--stage)
        DEPLOY_STAGE=1
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


cp -r GameSDK build/SproutLands

cd build

if [ $DEPLOY_PROD -eq 1 ]
then
   echo "Push to Production"
   aws s3 sync s3://kwigbo-stage s3://kwigbo --delete
   aws cloudfront create-invalidation --distribution-id ETU79Z47QN0GQ --paths "/*"
   aws cloudfront create-invalidation --distribution-id E3V1W7R1RD8X6Q --paths "/*"
elif [ $DEPLOY_STAGE -eq 1 ] 
then
   echo "Push to Stage"
   aws s3 sync . s3://kwigbo-stage --delete
   aws cloudfront create-invalidation --distribution-id E2JKIF9GO4EO8G --paths "/*"
   aws cloudfront create-invalidation --distribution-id EPWYAKGSI6IX8 --paths "/*"
else
   echo "Push to Local"
   WEB_PATH=~/Sites
   rm -r $WEB_PATH/*
   cp -r * $WEB_PATH
fi
