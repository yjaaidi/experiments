#!/bin/bash

# Function to generate library
generate_lib() {
  nx g @nx/angular:lib --name "$1" --directory "$2" --importPath "$3"
}

# Generate libraries

# Meal Planner Libraries
generate_lib "meal-planner-infra" "libs/meal-planner/infra" "@whiskmate/meal-planner/infra"
generate_lib "meal-planner-feature-meals" "libs/meal-planner/feature-meals" "@whiskmate/meal-planner/feature-meals"
generate_lib "meal-planner-feature-add-button" "libs/meal-planner/feature-add-button" "@whiskmate/meal-planner/feature-add-button"
generate_lib "meal-planner-domain" "libs/meal-planner/domain" "@whiskmate/meal-planner/domain"

# Recipe Libraries
generate_lib "recipe-shared-core" "libs/recipe-shared/core" "@whiskmate/recipe-shared/core"
generate_lib "recipe-shared-ui" "libs/recipe-shared/ui" "@whiskmate/recipe-shared/ui"
generate_lib "recipe-core" "libs/recipe/core" "@whiskmate/recipe/core"
generate_lib "recipe-infra" "libs/recipe/infra" "@whiskmate/recipe/infra"
generate_lib "recipe-feature-search" "libs/recipe/feature-search" "@whiskmate/recipe/feature-search"
generate_lib "recipe-feature-suggestions" "libs/recipe/feature-suggestions" "@whiskmate/recipe/feature-suggestions"
generate_lib "recipe-ui" "libs/recipe/ui" "@whiskmate/recipe/ui"

# Shared Libraries
generate_lib "shared-infra" "libs/shared/infra" "@whiskmate/shared/infra"
generate_lib "shared-util-testing" "libs/shared/util-testing" "@whiskmate/shared/util-testing"
generate_lib "shared-ui" "libs/shared/ui" "@whiskmate/shared/ui"

echo "Library generation complete!"
