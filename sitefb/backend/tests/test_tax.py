import os
import sys
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite://")
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.routers.tax import compute_tax

BRACKETS = [
    {"min": 0, "max": 10000, "rate": 0.1},
    {"min": 10000, "max": 20000, "rate": 0.2},
    {"min": 20000, "rate": 0.3},
]


def test_compute_tax_multiple_brackets():
    assert compute_tax(25000, BRACKETS) == 4500.0


def test_compute_tax_partial_second_bracket():
    assert compute_tax(15000, BRACKETS) == 2000.0


def test_compute_tax_first_bracket_only():
    assert compute_tax(5000, BRACKETS) == 500.0
