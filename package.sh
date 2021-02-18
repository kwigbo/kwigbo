#!/bin/bash

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp style.css build
cp manifest.json build
cp -r js build
cp -r favicon build
cp -r icons build
cp -r js build
mkdir build/js-util/
cp js-util/util.js build/js-util/util.js
cd build

# Run
python -m SimpleHTTPServer 8000
