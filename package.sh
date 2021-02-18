#!/bin/bash

# Clean Phase
rm -rf build
mkdir build

# Copy Phase
cp index.html build
cp -r js build
cp -r favicon build
cp -r icons build
cp -r meta build
cp -r js build
cd build

# Run
python -m SimpleHTTPServer 8000
