#!/bin/bash  
npm install
npm run build
rm -rf /var/www/html/*
cp -rf build/* /var/www/html/