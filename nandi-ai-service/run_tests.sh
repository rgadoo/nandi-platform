#!/bin/bash
# Script to run tests for the Nandi AI Service

echo "Running Nandi AI Service tests..."
python3 -m pytest -v -p no:selenium $@
echo "Done!" 