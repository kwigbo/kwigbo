#!/bin/bash

KWIGBO_ROOT=/var/www/html/kwigbo

# Clean Phase
rm -rf ${KWIGBO_ROOT}
mkdir ${KWIGBO_ROOT}

# Copy Phase
cp index.html ${KWIGBO_ROOT}
cp manifest.json ${KWIGBO_ROOT}
cp -r js ${KWIGBO_ROOT}
cp -r favicon ${KWIGBO_ROOT}
cp -r images ${KWIGBO_ROOT}
cp -r styles ${KWIGBO_ROOT}
cp -r js ${KWIGBO_ROOT}
