#!/bin/bash

# Clean installation with legacy peer dependencies flag
npm ci --legacy-peer-deps

# Build the project
npm run build
