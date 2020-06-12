#!/bin/bash  
npm install
npm run build
rm -rf ~/htdocs/*
cp -rf build/* ~/htdocs
