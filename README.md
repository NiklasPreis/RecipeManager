# 🍽️ RecipeManager

Ein selbst gehosteter Rezepte-Manager, inspiriert von [Mealie.io](https://mealie.io) – schlicht, schnell und vollständig in Docker deploybar.

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/get-docker/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-lizenz)

> **Dieses Projekt wurde vollständig mit [Claude Code](https://claude.ai/code) von Anthropic erstellt.**

---

## Inhalt

- [Features](#-features)
- [Schnellstart mit Docker](#-schnellstart-mit-docker)
- [Projektstruktur](#️-projektstruktur)
- [Tech Stack](#️-tech-stack)
- [Konfiguration](#️-konfiguration)
- [Lokale Entwicklung](#-lokale-entwicklung)
- [Lizenz](#-lizenz)

---

## ✨ Features

- 📖 **Rezepte verwalten** – Erstellen, bearbeiten, löschen und anzeigen
- 🖼️ **Foto-Upload** – Drag & Drop oder Klick zum Hochladen
- 🗂️ **Kategorien** – Eigene Kategorien anlegen und Rezepte filtern
- 🏷️ **Tags** – Freie Tags vergeben und als Filter nutzen
- 🔍 **Suche** – Live-Suche über Titel und Beschreibung
- 📱 **Responsive** – Funktioniert auf Desktop und Mobilgeräten
- 🐳 **Docker-Ready** – Ein Befehl genügt zum Starten

---

## 🚀 Schnellstart mit Docker

### Voraussetzungen

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### Starten

```bash
git clone https://github.com/NiklasPreis/RecipeManager.git
cd RecipeManager
docker compose up --build -d
```

Die App ist dann erreichbar unter: **http://localhost:3000**

Alle Daten (Datenbank + Fotos) werden in einem persistenten Docker Volume gespeichert und bleiben beim Neustart erhalten.

### Stoppen

```bash
docker compose down
```

### Updates einspielen

```bash
git pull
docker compose up --build -d
```

---

## 🗂️ Projektstruktur

```
RecipeManager/
├── src/
│   ├── renderer/                   # React-Frontend (Vite)
│   │   └── src/
│   │       ├── pages/               # HomePage, NewRecipePage, RecipeDetailPage, EditRecipePage
│   │       ├── components/          # Navigation, RecipeCard, RecipeForm, CategoryManager
│   │       ├── App.tsx
│   │       └── types.ts
│   └── server/                     # Express-Backend
│       ├── routes/                  # recipes, categories, tags, uploads
│       ├── db.ts                    # Prisma Client
│       ├── config.ts
│       └── index.ts
├── prisma/
│   └── schema.prisma                # Datenbankschema
├── Dockerfile                       # Multi-Stage Docker Build
├── docker-compose.yml
└── entrypoint.sh                    # DB-Migration + App-Start
```

---

## 🛠️ Tech Stack

| Bereich      | Technologie                                       |
|--------------|----------------------------------------------------|
| Frontend     | [React 18](https://react.dev) + [Vite](https://vitejs.dev), [React Router](https://reactrouter.com) |
| Backend      | [Express](https://expressjs.com)                   |
| Sprache      | TypeScript                                          |
| Datenbank    | SQLite via [Prisma ORM](https://www.prisma.io)      |
| Styling      | [Tailwind CSS](https://tailwindcss.com)             |
| Deployment   | Docker (Multi-Stage-Build)                          |

---

## ⚙️ Konfiguration

Die App wird über Umgebungsvariablen konfiguriert. Standardwerte sind für Docker voreingestellt:

| Variable       | Standard                | Beschreibung                        |
|----------------|--------------------------|--------------------------------------|
| `DATABASE_URL` | `file:/data/recipes.db`  | Pfad zur SQLite-Datenbank            |
| `UPLOAD_DIR`   | `/data/uploads`          | Verzeichnis für hochgeladene Bilder  |

Für eine eigene Konfiguration die `docker-compose.yml` anpassen oder eine `.env` Datei anlegen (siehe `.env.example`).

---

## 🌐 Lokale Entwicklung

Node.js (≥ 20) und npm werden benötigt:

```bash
npm install
cp .env.example .env
# .env anpassen: DATABASE_URL="file:./dev.db"
npm run db:push
npm run dev
```

App läuft dann auf **http://localhost:3000**.

---

## 📄 Lizenz

MIT – frei nutzbar und anpassbar.

---

<p align="center">
  Erstellt mit <a href="https://claude.ai/code">Claude Code</a> · Betrieben mit React, Express & Docker
</p>
