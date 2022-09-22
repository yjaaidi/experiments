#!/usr/bin/env sh

set -e

PROJECT=marmicode-workshop-api-2022-09
IMAGE="europe-west1-docker.pkg.dev/$PROJECT/marmicode/recipes-service"
TAG="next"

log() {
  echo "\n\n $1"
}

update_traffic() {
  gcloud run services update-traffic recipes-service --to-tags "$TAG=$1"
}

wait() {
  log "⏳ Waiting for $1 seconds..."
  sleep "$1"
}

check_logs_and_rollback_on_error() {
  log "📝 Checking logs for errors..."
  ERROR_LOGS=$(gcloud logging read "resource.type=cloud_run_revision resource.labels.service_name=recipes-service resource.labels.revision_name=$REVISION_NAME severity=ERROR")
  if [ -n "$ERROR_LOGS" ]
  then
    log "🚨 Rolling back due to errors in logs..."
    echo "$ERROR_LOGS"
    # ... and rollback
    update_traffic 0
    exit 1
  fi
}

deploy() {
  gcloud run deploy recipes-service  \
    --project "$PROJECT" \
    --region europe-west1 \
    --image "$IMAGE" \
    --allow-unauthenticated \
    --no-traffic \
    --tag "$TAG" \
    --format json
}

log "🛠 Setting up docker repository..."
gcloud artifacts repositories describe marmicode --project "$PROJECT" --location europe-west1 \
|| gcloud artifacts repositories create marmicode --project "$PROJECT" --location europe-west1 --repository-format docker

log "📦 Packaging application..."
yarn build
docker build . -f src/Dockerfile -t "$IMAGE"
docker push "$IMAGE"

log "🚀 Deploying application..."
CLOUD_RUN_RESULT=$(deploy)
NEXT_URL=$(echo "$CLOUD_RUN_RESULT" | jq -r '.status.traffic[-1].url')
REVISION_NAME=$(echo "$CLOUD_RUN_RESULT" | jq -r '.status.latestCreatedRevisionName')

log "✅ Running smoke tests..."
BASE_URL="$NEXT_URL" yarn test
wait 60
check_logs_and_rollback_on_error

log "🧪 Routing 10% traffic..."
update_traffic 10

wait 60
check_logs_and_rollback_on_error

log "🎉 All-in, routing 100% traffic..."
update_traffic 100

wait 60
check_logs_and_rollback_on_error

log "✨ Done!"