CREATE IF NOT EXISTS DATABASE transitops_db;

CREATE IF NOT EXISTS SCHEMA auth;
CREATE IF NOT EXISTS SCHEMA vehicle;
CREATE IF NOT EXISTS SCHEMA driver;
CREATE IF NOT EXISTS SCHEMA trip;
CREATE IF NOT EXISTS SCHEMA maintenance;
CREATE IF NOT EXISTS SCHEMA fuel;
CREATE IF NOT EXISTS SCHEMA expense;
CREATE IF NOT EXISTS SCHEMA reporting;
CREATE IF NOT EXISTS IF NOT EXISTS SCHEMA notification;


CREATE IF NOT EXISTS TABLE vehicle.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    max_load_capacity NUMERIC(10,2) NOT NULL,
    odometer NUMERIC(12,2) DEFAULT 0,
    acquisition_cost NUMERIC(12,2),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Available','On Trip','In Shop','Retired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE driver.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20),
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score NUMERIC(5,2) DEFAULT 100,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Available','On Trip','Off Duty','Suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE trip.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL,
    driver_id UUID NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    cargo_weight NUMERIC(10,2) NOT NULL,
    planned_distance NUMERIC(10,2),
    actual_distance NUMERIC(10,2),
    final_odometer NUMERIC(12,2),
    fuel_consumed NUMERIC(10,2),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Draft','Dispatched','Completed','Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE maintenance.maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL,
    maintenance_type VARCHAR(100),
    description TEXT,
    cost NUMERIC(12,2),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Open','Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE IF NOT EXISTS TABLE fuel.fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL,
    trip_id UUID,
    liters NUMERIC(10,2) NOT NULL,
    cost NUMERIC(12,2) NOT NULL,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE expense.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL,
    trip_id UUID,
    expense_type VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE reporting.fleet_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    active_vehicles INT,
    available_vehicles INT,
    vehicles_in_maintenance INT,
    active_trips INT,
    fleet_utilization NUMERIC(5,2),
    total_operational_cost NUMERIC(14,2)
);

CREATE IF NOT EXISTS TABLE notification.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);

CREATE IF NOT EXISTS TABLE auth.roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE IF NOT EXISTS TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE IF NOT EXISTS TABLE auth.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INT REFERENCES auth.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);