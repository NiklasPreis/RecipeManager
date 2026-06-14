#!/bin/sh
set -e
mkdir -p /data/uploads
npx prisma db push --skip-generate
exec node dist/server/index.js
