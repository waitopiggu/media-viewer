#!/usr/bin/env bash

WD="$(pwd)"

APP_BIN_WIN=web-media-viewer.exe
ELECTRON_BIN_WIN=electron.exe

DIST_DIR=$WD/dist
ELECTRON_DIR=$WD/node_modules/electron/dist
OUTPUT_DIR=$DIST_DIR/resources/app
SCRIPTS_DIR=$WD/scripts

PACKAGE_JSON=$WD/package.json
PACKAGE_JSON_CLEANUP=$SCRIPTS_DIR/cleanup-package-json

echo "cleaning dist..."
rm -rf $DIST_DIR

echo "copying electron..."
cp -rf  $ELECTRON_DIR $DIST_DIR

echo "renaming executable..."
mv -f $DIST_DIR/$ELECTRON_BIN_WIN $DIST_DIR/$APP_BIN_WIN

echo "running webpack..."
yarn webpack-prod

echo "copying app files..."
mkdir -p dist/resources/app
cp -f build/* $OUTPUT_DIR

echo "creating package.json..."
node $PACKAGE_JSON_CLEANUP $PACKAGE_JSON $OUTPUT_DIR

echo "finished!"
