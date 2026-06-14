#!/bin/sh
set -e

mkdir -p /data/uploads

# Datenbank-Schema anlegen/aktualisieren (erstellt DB wenn nicht vorhanden)
npx prisma db push --skip-generate

exec npm start
