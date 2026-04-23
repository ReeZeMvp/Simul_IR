from __future__ import annotations
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from ..models.fiscal import BaremeIR, Tranche, AplZone

router = APIRouter(prefix="/api", tags=["barème"])

DATA_DIR = Path(__file__).parent.parent / "data"
ANNEES_DISPONIBLES = [2026, 2027]


def _load(annee: int) -> dict:
    path = DATA_DIR / f"bareme_{annee}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Barème {annee} introuvable")
    return json.loads(path.read_text(encoding="utf-8"))


@router.get("/bareme/{annee}", response_model=BaremeIR)
def get_bareme(annee: int):
    """Retourne le barème IR complet pour une année donnée."""
    if annee not in ANNEES_DISPONIBLES:
        raise HTTPException(
            status_code=404,
            detail=f"Année {annee} non disponible. Années : {ANNEES_DISPONIBLES}",
        )
    return _load(annee)


@router.get("/bareme/{annee}/tranches", response_model=list[Tranche])
def get_tranches(annee: int):
    """Retourne uniquement les tranches IR."""
    data = _load(annee)
    return data["tranches"]


@router.get("/config/apl", response_model=dict[str, AplZone])
def get_apl():
    """Retourne la configuration APL par zone (basée sur 2026)."""
    data = _load(2026)
    return data.get("apl", {})


@router.get("/config/constantes")
def get_constantes():
    """Retourne les constantes fiscales principales (SMIC, FORFAIT, plafonds)."""
    data = _load(2026)
    return {
        "smic": data.get("smic"),
        "csg_rate": data.get("csg_rate"),
        "pee_cap": data.get("pee_cap"),
        "abattement": data.get("abattement"),
        "plafond_demi_part": data.get("plafond_demi_part"),
        "ppa": data.get("ppa"),
        "pea": data.get("pea"),
        "pfu": data.get("pfu"),
        "annees_disponibles": ANNEES_DISPONIBLES,
    }
