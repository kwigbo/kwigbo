#!/bin/bash

# Default values of arguments
DEPLOY_PROD=0
DEPLOY_STAGE=0
DEPLOY_ALL=0

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
    case $arg in
        -a|--all)
        DEPLOY_ALL=1
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
cp FidgetLoreTracker.html build
cp manifest.json build

cp -r favicon build

cp -r GameSDK build
cp -r MainScene build
cp -r SproutLands build
cp -r Avastars build
cp -r Veve build

cp -r GameSDK build/Avastars
cp -r GameSDK build/SproutLands

mkdir build/SproutLands/Maps
cp build/SproutLands/AssetManager/MapSource/MainMap.json build/SproutLands/Maps/MainMap.json
cp build/SproutLands/AssetManager/MapSource/FlowerMap.json build/SproutLands/Maps/FlowerMap.json
rm -r build/SproutLands/AssetManager/MapSource

cd build

if [ $DEPLOY_STAGE -eq 1 ] || [ $DEPLOY_ALL -eq 1 ]
then
   echo "Push to Stage"
   aws s3 sync . s3://kwigbo-stage --delete
   aws cloudfront create-invalidation --distribution-id E2JKIF9GO4EO8G --paths "/*"
   aws cloudfront create-invalidation --distribution-id EPWYAKGSI6IX8 --paths "/*"
fi

if [ $DEPLOY_PROD -eq 1 ] || [ $DEPLOY_ALL -eq 1 ]
then
   echo "Push to Production"
   aws s3 sync s3://kwigbo-stage s3://kwigbo --delete
   aws cloudfront create-invalidation --distribution-id ETU79Z47QN0GQ --paths "/*"
   aws cloudfront create-invalidation --distribution-id E3V1W7R1RD8X6Q --paths "/*"
fi

echo "Push to Local"
WEB_PATH=~/Sites
rm -r $WEB_PATH/*
cp -r * $WEB_PATH
