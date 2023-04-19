#!/bin/bash

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp manifest.json build

cp -r favicon build

cp -r GameSDK build
cp -r MainScene build
cp -r SproutLands build
cp -r VeveScene build

cd build

WEB_PATH=~/Sites

rm -r $WEB_PATH/*
cp -r * $WEB_PATH
