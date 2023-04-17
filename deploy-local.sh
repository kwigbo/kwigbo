#!/bin/bash

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp manifest.json build
cp -r MainApp build
cp -r favicon build
cp -r MainScene build
cp -r fonts build
cp -r VeveScene build
cp -r images build
cd build

WEB_PATH=~/Sites

rm -r $WEB_PATH/*
cp -r * $WEB_PATH
