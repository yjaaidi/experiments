#!/usr/bin/env sh

set -e

PROJECT=marmicode-workshop-api-2022-09
IMAGE="europe-west1-docker.pkg.dev/$PROJECT/marmicode/recipes-service"

gcloud artifacts repositories create marmicode --project "$PROJECT" --location europe-west1 --repository-format docker || echo "⏩ skip arfifacts repository creation as it already exists"

yarn build
docker build . -f src/Dockerfile -t "$IMAGE"
docker push "$IMAGE"

gcloud run deploy recipes-service  --project "$PROJECT" --region europe-west1 --image "$IMAGE" --allow-unauthenticated
