#!/bin/bash
cd i18n
find . -type f -name "*.md" -exec sed -i 's/- - -/---/g' {} +
find . -type f -name "*.mdx" -exec sed -i 's/- - -/---/g' {} +
find . -type f -name "*.md" -exec sed -i 's/“/"/g' {} +
find . -type f -name "*.mdx" -exec sed -i 's/“/"/g' {} +
find . -type f -name "*.md" -exec sed -i 's/”/"/g' {} +
find . -type f -name "*.mdx" -exec sed -i 's/”/"/g' {} +
find . -type f -name "*.md" -exec sed -i 's/：/:/g' {} +
find . -type f -name "*.mdx" -exec sed -i 's/：/:/g' {} +
