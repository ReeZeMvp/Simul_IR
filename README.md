# Simul'IR 2026 — Simulateur fiscal PACS vs Séparés

Simulateur fiscal français 2026 : IR, APL, PPA, PEA, CTO.  
Stack : **React + Vite** · **FastAPI** · **Docker** · **Caddy** (TLS auto).

---

## Démarrage rapide

```bash
git clone https://github.com/user/simulir && cd simulir
docker compose up -d
# Ouvrir http://localhost
```

### Développement local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (autre terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Architecture

```
simulir/
├── frontend/          React + Vite + TypeScript
│   └── src/
│       ├── engine/    Moteur fiscal (IR, APL, PPA, PEA, CTO)
│       └── components/
│           ├── SetupPhase/      Formulaires profils
│           ├── ResultsPhase/    Tableaux, graphiques, verdict
│           └── InvestmentsPhase/ PEA / CTO
├── backend/           FastAPI — expose les barèmes JSON
│   └── app/
│       ├── data/      bareme_2026.json, bareme_2027.json
│       ├── routers/   endpoints REST
│       └── models/    Pydantic schemas
└── caddy/             Reverse proxy + TLS automatique
```

**Le moteur de calcul est côté frontend** — le backend sert uniquement les barèmes et constantes.

---

## Déploiement

### Raspberry Pi 5 (homelab arm64)

```bash
git clone https://github.com/user/simulir && cd simulir
docker compose up -d
docker compose logs -f backend
```

### GCP Cloud Run

```bash
gcloud run deploy simulir-frontend \
  --source ./frontend \
  --region europe-west1 \
  --allow-unauthenticated

gcloud run deploy simulir-backend \
  --source ./backend \
  --region europe-west1 \
  --set-env-vars APP_ENV=production
```

### AWS App Runner

```bash
aws apprunner create-service \
  --service-name simulir \
  --source-configuration '{"CodeRepository":{"RepositoryUrl":"https://github.com/user/simulir","SourceCodeVersion":{"Type":"BRANCH","Value":"main"}}}'
```

### Images multi-arch (GitHub Actions)

Les images sont buildées automatiquement pour `linux/amd64` et `linux/arm64` sur chaque push sur `main` via `.github/workflows/build-push.yml` et publiées sur GHCR.

---

## Mise à jour des barèmes

Les barèmes sont versionnés en JSON dans `backend/app/data/`.  
Procédure après chaque loi de finances (février N+1) :

1. Créer `backend/app/data/bareme_{annee}.json` en copiant l'année précédente
2. Mettre à jour les tranches, l'abattement, la décote, le SMIC
3. Ajouter l'année dans `ANNEES_DISPONIBLES` dans `backend/app/routers/bareme.py`
4. Mettre à jour les constantes dans `frontend/src/engine/bareme.ts`
5. Lancer les tests : `cd frontend && npm run test:engine`
6. Commit + push → CI rebuilde automatiquement

---

## Sources de données fiscales

| Source | Usage |
|---|---|
| [Barèmes IPP](https://data.gouv.fr/datasets/baremes-ipp-systeme-social-et-fiscal-francais) | CSV annuels IR, cotisations, plafonds |
| [service-public.fr](https://www.service-public.fr/particuliers/actualites/A18045) | Barème IR officiel 2026 |
| [LégiFiscal](https://www.legifiscal.fr) | Actualités PLF, barèmes détaillés |
| [Légifrance](https://www.legifrance.gouv.fr) | Texte loi de finances |

---

## Tests

```bash
cd frontend
npm run test:engine   # Tests unitaires moteur (Jest)
```

---

## API Backend

Documentation interactive : `http://localhost:8000/api/docs`

| Endpoint | Description |
|---|---|
| `GET /api/bareme/{annee}` | Barème IR complet |
| `GET /api/bareme/{annee}/tranches` | Tranches IR uniquement |
| `GET /api/config/apl` | Configuration APL par zone |
| `GET /api/config/constantes` | SMIC, forfaits, plafonds |
| `GET /health` | Health check Docker |
