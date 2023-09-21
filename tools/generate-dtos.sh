#!/usr/bin/env sh

set -e

OUTPUT_DIR=src/dtos

rm -Rf src/dtos

pnpm openapi-generator-cli generate -i src/recipes.openapi.yaml -g typescript-angular -o $OUTPUT_DIR --additional-properties fileNaming=kebab-case,modelSuffix=dto --global-property models

if [ "$(uname -s)" = "Darwin" ]
then
  sed -i '' 's/dto-dto/dto/g' $OUTPUT_DIR/model/*.ts
else
  sed -i 's/dto-dto/dto/g' $OUTPUT_DIR/model/*.ts
fi
