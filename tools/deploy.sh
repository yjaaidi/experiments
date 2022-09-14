#!/usr/bin/env sh

set -e

IMAGE=europe-west1-docker.pkg.dev/marmicode-workshop-api-2022-06/marmicode/recipes-service

yarn build
docker build . -f src/Dockerfile -t "$IMAGE"
docker push "$IMAGE"
gcloud run deploy recipes-service --region europe-west1 --image "$IMAGE" --allow-unauthenticated
