from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(
    title="MOIL AI Platform API",
    description="Backend services for Predictive Mining & Intelligence",
    version="1.0.0"
)

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "operational", "timestamp": datetime.now()}

# ----------------- GEOSPATIAL & EXPLORATION -----------------
@app.get("/api/mines")
def get_mines():
    return {"data": [{"id": 1, "name": "Balaghat Mine", "status": "Active"}]}

@app.get("/api/blocks")
def get_blocks(mine_id: int = None):
    return {"data": [{"block_id": "B-01", "name": "Block B", "available_reserves": 540000}]}

@app.get("/api/geology")
def get_geological_data(block_id: str = None):
    return {"data": {"rock_type": "Manganese Ore", "average_grade": "48%"}}

@app.get("/api/drillholes")
def get_drillholes():
    return {"data": [{"hole_id": "DH-101", "depth": 140, "grade": 49.2}]}

@app.get("/api/satellite")
def get_satellite_analysis():
    return {"data": {"ndvi_mean": 0.42, "swir_anomaly": False, "environmental_risk": "Low"}}

@app.get("/api/prospectivity")
def get_prospectivity(block_id: str = None):
    # Conceptual ML model output from Random Forest / XGBoost
    return {
        "block_id": block_id or "C-12",
        "prospectivity_probability": 0.87,
        "confidence": 0.82,
        "predicted_mn_grade": 31.4,
        "important_features": {
            "SWIR_anomaly": 0.28,
            "geology": 0.24,
            "nearby_drillholes": 0.19,
            "bare_soil": 0.15
        }
    }

# ----------------- PRODUCTION & OPERATIONS -----------------
@app.get("/api/production")
def get_production_logs():
    return {"data": [{"date": "2026-09-02", "target": 5000, "actual": 4850}]}

@app.get("/api/equipment")
def get_equipment_telemetry():
    return {"data": [{"equip_id": "EX-04", "status": "Maintenance", "health_score": 45}]}

@app.get("/api/forecast")
def get_production_forecast():
    # Call to internal LSTM/Prophet model logic combined with random forest shortfall predictors
    return {
        "predicted_production": 38200,
        "target_production": 45000,
        "shortfall": 6800,
        "probability": 0.72,
        "risk": "HIGH",
        "causes": {
            "equipment": 0.45,
            "rainfall": 0.25,
            "blasting": 0.15,
            "ore_availability": 0.10,
            "others": 0.05
        }
    }

# ----------------- RISKS & AI RECOMMENDATIONS -----------------
@app.get("/api/risks")
def get_operational_risks():
    return {"data": [
        {"type": "Equipment", "level": "CRITICAL", "probability": 88, "cause": "EX-04 vibration"}
    ]}

@app.get("/api/recommendations")
def get_ai_recommendations():
    return {"data": [
        {"action": "Re-deploy EX-07 to Block B", "priority": "HIGH", "expected_impact": "+2500 MT"}
    ]}

@app.get("/api/scenarios")
def simulate_scenario(exc_avail: int, blast_delay: int):
    # Conceptual simulation model calculation
    return {"data": {"new_production": 148400, "new_shortfall": 1600}}

@app.get("/api/reports")
def generate_report(report_type: str):
    return {"data": {"report_id": "RPT-901", "status": "Generated", "download_url": "/downloads/RPT-901.pdf"}}
