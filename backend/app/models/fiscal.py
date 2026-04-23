from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class Tranche(BaseModel):
    max: Optional[float]  # None = Infinity
    taux: float


class Abattement(BaseModel):
    min: float
    max: float
    retraite_max: float


class Decote(BaseModel):
    seuil: float
    base: float


class DecoteConfig(BaseModel):
    seul: Decote
    couple: Decote


class Smic(BaseModel):
    mensuel_brut: float
    mensuel_net: float
    annuel_brut: float


class AplZone(BaseModel):
    p: float
    cap: float


class Ppa(BaseModel):
    forfait_seul: float
    forfait_couple: float
    taux_revenu: float


class PeaConfig(BaseModel):
    plafond_versement: float
    duree_exoneration_ir: int
    taux_ps: float
    taux_ir_avant_5ans: float


class PfuConfig(BaseModel):
    taux_total: float
    taux_ir: float
    taux_ps: float


class BaremeIR(BaseModel):
    annee: int
    source: str
    mis_a_jour: str
    revalorisation: float
    tranches: list[Tranche]
    abattement: Abattement
    plafond_demi_part: float
    decote: DecoteConfig
    smic: Optional[Smic] = None
    csg_rate: Optional[float] = None
    pee_cap: Optional[float] = None
    apl: Optional[dict[str, AplZone]] = None
    ppa: Optional[Ppa] = None
    pea: Optional[PeaConfig] = None
    pfu: Optional[PfuConfig] = None
