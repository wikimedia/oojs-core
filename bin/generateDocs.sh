#!/usr/bin/env bash -e
cd $(cd $(dirname $0)/..; pwd)

version=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("package.json")).version);')
jsduck --config jsduck.config.json --footer "Documentation for OOjs v$version."
