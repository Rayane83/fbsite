# Portail Entreprise Flashback Fa (Custom Env)

Stack: FastAPI + MySQL (SQLAlchemy + Alembic) + Vite React TypeScript (à venir)

## Démarrage rapide

1. Lancez le script de configuration qui installera les dépendances, demandera les variables d'environnement et démarrera le serveur:

```
./scripts/setup.sh
```

- API: http://localhost:8001
- Santé: GET http://localhost:8001/api/health

## Variables d'environnement backend

Le script crée le fichier `backend/.env` avec les champs suivants:
- DATABASE_URL
- DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN
- JWT_SECRET, JWT_EXPIRE_HOURS, ENCRYPTION_KEY
- FRONTEND_URL, REDIRECT_URI_DEV, REDIRECT_URI_PROD
- CORS_ORIGINS, ENV
- STAFF_ROLE_ID, SUPERADMIN_DISCORD_ID

## Migrations Alembic

Au démarrage, `alembic upgrade head` est exécuté. Pour lancer manuellement:

```
cd backend
alembic upgrade head
```

## Frontend

Le frontend Vite + React + TypeScript + Tailwind + shadcn/ui arrive dans le prochain commit (Login réel Discord, Dashboard cartes, Dotations tableau éditable).
