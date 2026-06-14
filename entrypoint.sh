#!/bin/sh
set -e

# Datenverzeichnis vorbereiten
mkdir -p /data/uploads

# Datenbank-Schema deployen (erstellt DB wenn nicht vorhanden)
npx prisma db push --skip-generate

# App starten
exec node server.js
