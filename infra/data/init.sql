--------------------------------------------------------
-- IOT PLATFORM DATABASE INITIALIZATION
--------------------------------------------------------

--------------------------------------------------------
-- 1) TABLE: SENSORS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    sensor_uid VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add 4 sensors for testing
INSERT INTO sensors (sensor_uid, name, location)
VALUES 
    ('sensor_001', 'Temperature Sensor 1', 'Warehouse A'),
    ('sensor_002', 'Humidity Sensor 1', 'Warehouse B'),
    ('sensor_003', 'Pressure Sensor 1', 'Warehouse C'),
    ('sensor_004', 'Light Sensor 1', 'Warehouse D')
ON CONFLICT (sensor_uid) DO NOTHING;

--------------------------------------------------------
-- 2) TABLE: METRIC TYPES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS metric_types (
    id SERIAL PRIMARY KEY,
    type_uid VARCHAR(50) NOT NULL,
    description TEXT,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT metric_types_type_uid_unit_key UNIQUE (type_uid, unit)
);

-- Add some metric types for testing
INSERT INTO metric_types (type_uid, unit, description)
VALUES
    ('temperature', '°C', 'Ambient temperature in Celsius'),
    ('humidity', '%', 'Relative humidity percentage'),
    ('pressure', 'hPa', 'Atmospheric pressure in hectopascals'),
    ('light', 'lux', 'Illuminance in lux'),
    ('co2', 'ppm', 'Carbon dioxide concentration in parts per million')
ON CONFLICT (type_uid, unit) DO NOTHING;

--------------------------------------------------------
-- 3) TABLE: READINGS
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id INT NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    "timestamp" TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

--------------------------------------------------------
-- 4) TABLE: READING VALUES
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS reading_values (
    id BIGSERIAL PRIMARY KEY,
    reading_id BIGINT NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
    metric_type_id INT NOT NULL REFERENCES metric_types(id),
    value DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT reading_values_reading_id_metric_type_id_key UNIQUE (reading_id, metric_type_id)
);

--------------------------------------------------------
-- 5) INDEXES
--------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_readings_sensor_id ON readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_reading_values_reading_id ON reading_values(reading_id);
CREATE INDEX IF NOT EXISTS idx_reading_values_metric_type_id ON reading_values(metric_type_id);