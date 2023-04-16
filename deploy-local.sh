#!/bin/bash

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp manifest.json build
cp -r js build
cp -r favicon build
cp -r images build
cp -r styles build
cp -r js build
cd build

WEB_PATH=~/Sites

rm -r $WEB_PATH/*
cp -r * $WEB_PATH
