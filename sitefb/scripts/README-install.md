# Installation (VPS) — npm ou script unique

## Variante FULL NPM (recommandée si vous préférez npm)

1) Root & code
```
sudo -i
cd /opt
git clone git@github.com:Rayane83/sitefb.git
cd sitefb
git fetch origin && git checkout feature/ui-shadcn && git pull origin feature/ui-shadcn
cd scripts
```

2) Lancer l'installateur npm
```
bash install_sitefb_npm.sh --domain flashbackfa-entreprise.fr \
  --branch feature/ui-shadcn \
  --db-url "mysql+pymysql://Staff:Fbentreprise83%40@51.75.200.221:3306/Sitefb" \
  --email votre_email@domaine.fr
```
Il vous demandera DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN. Il génère JWT_SECRET et ENCRYPTION_KEY.

3) Vérifier
- https://flashbackfa-entreprise.fr
- curl http://127.0.0.1:8001/api/health

## Variante Docker + yarn (existante)
Voir install_sitefb.sh si vous préférez yarn via conteneur.