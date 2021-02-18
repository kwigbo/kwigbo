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

# Run -  local development
python -m SimpleHTTPServer 8000
