-- MOIL AI Database Schema (PostgreSQL + PostGIS)

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE mines (
    mine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE blocks (
    block_id VARCHAR(50) PRIMARY KEY,
    mine_id INTEGER REFERENCES mines(mine_id),
    name VARCHAR(100),
    boundary GEOMETRY(Polygon, 4326),
    estimated_reserves NUMERIC
);

CREATE TABLE drillholes (
    hole_id VARCHAR(50) PRIMARY KEY,
    block_id VARCHAR(50) REFERENCES blocks(block_id),
    location GEOMETRY(Point, 4326),
    max_depth NUMERIC,
    drill_date DATE
);

CREATE TABLE assay_results (
    assay_id SERIAL PRIMARY KEY,
    hole_id VARCHAR(50) REFERENCES drillholes(hole_id),
    depth_from NUMERIC,
    depth_to NUMERIC,
    mn_grade_pct NUMERIC,
    fe_grade_pct NUMERIC,
    p_grade_pct NUMERIC
);

CREATE TABLE production_logs (
    log_id SERIAL PRIMARY KEY,
    block_id VARCHAR(50) REFERENCES blocks(block_id),
    log_date DATE,
    target_mt NUMERIC,
    actual_mt NUMERIC,
    equip_downtime_hrs NUMERIC,
    weather_delay_hrs NUMERIC
);

CREATE TABLE equipment (
    equip_id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50),
    mine_id INTEGER REFERENCES mines(mine_id),
    purchase_date DATE,
    status VARCHAR(50)
);

CREATE TABLE equipment_telemetry (
    telemetry_id SERIAL PRIMARY KEY,
    equip_id VARCHAR(50) REFERENCES equipment(equip_id),
    timestamp TIMESTAMP,
    vibration_hz NUMERIC,
    temperature_c NUMERIC,
    fuel_level_pct NUMERIC
);
