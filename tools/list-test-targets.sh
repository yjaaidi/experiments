#!/usr/bin/env sh

set -e

nx show project demo | jq -r '.targets | to_entries[] | .key' | grep -v -e build -e lint -e serve -e extract-i18n
