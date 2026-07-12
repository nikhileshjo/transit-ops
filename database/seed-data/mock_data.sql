INSERT INTO auth.roles (role_name) VALUES
('Fleet Manager'),
('Dispatcher'),
('Safety Officer'),
('Financial Analyst'),
('Driver')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO auth.users (name, email, password_hash, is_active) VALUES
('John Manager', 'john.manager@transitops.com', '$2b$10$examplehash', TRUE),
('Emily Dispatcher', 'emily.dispatcher@transitops.com', '$2b$10$examplehash', TRUE),
('Michael Safety', 'michael.safety@transitops.com', '$2b$10$examplehash', TRUE),
('Sarah Finance', 'sarah.finance@transitops.com', '$2b$10$examplehash', TRUE),
('Alex Driver', 'alex.driver@transitops.com', '$2b$10$examplehash', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Assign roles to users
INSERT INTO auth.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM auth.users u
JOIN auth.roles r ON
    (u.email = 'john.manager@transitops.com' AND r.role_name = 'Fleet Manager') OR
    (u.email = 'emily.dispatcher@transitops.com' AND r.role_name = 'Dispatcher') OR
    (u.email = 'michael.safety@transitops.com' AND r.role_name = 'Safety Officer') OR
    (u.email = 'sarah.finance@transitops.com' AND r.role_name = 'Financial Analyst') OR
    (u.email = 'alex.driver@transitops.com' AND r.role_name = 'Driver')
ON CONFLICT DO NOTHING;

-- --------------------
-- VEHICLE SCHEMA
-- --------------------

INSERT INTO vehicle.vehicles (
    registration_number,
    vehicle_name,
    vehicle_type,
    max_load_capacity,
    odometer,
    acquisition_cost,
    status
) VALUES
('KA01AB1234', 'Van-05', 'Van', 500, 15000, 850000, 'Available'),
('KA01CD5678', 'Truck-12', 'Truck', 3000, 42000, 2500000, 'Available'),
('KA01EF9012', 'Mini-07', 'Mini Truck', 1000, 22000, 1200000, 'In Shop'),
('KA01GH3456', 'Truck-22', 'Truck', 5000, 76000, 3500000, 'Retired')
ON CONFLICT (registration_number) DO NOTHING;

-- --------------------
-- DRIVER SCHEMA
-- --------------------

INSERT INTO driver.drivers (
    name,
    license_number,
    license_category,
    license_expiry_date,
    contact_number,
    safety_score,
    status
) VALUES
('Alex', 'DL12345678', 'LMV', '2028-12-31', '9876543210', 95, 'Available'),
('Ravi Kumar', 'DL87654321', 'HMV', '2027-05-15', '9876501234', 88, 'Available'),
('Suresh Patel', 'DL45678901', 'HMV', '2026-03-20', '9876512345', 92, 'On Trip'),
('Anita Sharma', 'DL23456789', 'LMV', '2025-08-10', '9876523456', 90, 'Suspended')
ON CONFLICT (license_number) DO NOTHING;

-- --------------------
-- TRIP SCHEMA
-- --------------------
-- Uses subqueries to fetch generated IDs

INSERT INTO trip.trips (
    vehicle_id,
    driver_id,
    source,
    destination,
    cargo_weight,
    planned_distance,
    actual_distance,
    final_odometer,
    fuel_consumed,
    status
) VALUES
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01AB1234'),
    (SELECT id FROM driver.drivers WHERE license_number = 'DL12345678'),
    'Bangalore',
    'Mysore',
    450,
    145,
    150,
    15150,
    12,
    'Completed'
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01CD5678'),
    (SELECT id FROM driver.drivers WHERE license_number = 'DL45678901'),
    'Bangalore',
    'Chennai',
    2500,
    350,
    NULL,
    NULL,
    NULL,
    'Dispatched'
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01AB1234'),
    (SELECT id FROM driver.drivers WHERE license_number = 'DL87654321'),
    'Mysore',
    'Hubli',
    300,
    320,
    NULL,
    NULL,
    NULL,
    'Draft'
);

-- --------------------
-- MAINTENANCE SCHEMA
-- --------------------

INSERT INTO maintenance.maintenance_logs (
    vehicle_id,
    maintenance_type,
    description,
    cost,
    status,
    closed_at
) VALUES
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01EF9012'),
    'Oil Change',
    'Engine oil replacement and filter check',
    3500,
    'Open',
    NULL
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01AB1234'),
    'Brake Inspection',
    'Brake pad replacement',
    4500,
    'Closed',
    CURRENT_TIMESTAMP - INTERVAL '14 days'
);

-- --------------------
-- FUEL SCHEMA
-- --------------------

INSERT INTO fuel.fuel_logs (
    vehicle_id,
    trip_id,
    liters,
    cost,
    log_date
) VALUES
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01AB1234'),
    (SELECT id FROM trip.trips WHERE source = 'Bangalore' AND destination = 'Mysore'),
    12,
    1200,
    CURRENT_DATE - INTERVAL '2 days'
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01CD5678'),
    (SELECT id FROM trip.trips WHERE source = 'Bangalore' AND destination = 'Chennai'),
    40,
    4200,
    CURRENT_DATE - INTERVAL '1 day'
);

-- --------------------
-- EXPENSE SCHEMA
-- --------------------

INSERT INTO expense.expenses (
    vehicle_id,
    trip_id,
    expense_type,
    amount,
    expense_date,
    description
) VALUES
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01AB1234'),
    (SELECT id FROM trip.trips WHERE source = 'Bangalore' AND destination = 'Mysore'),
    'Toll',
    250,
    CURRENT_DATE - INTERVAL '2 days',
    'Mysore road toll'
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01CD5678'),
    (SELECT id FROM trip.trips WHERE source = 'Bangalore' AND destination = 'Chennai'),
    'Fuel',
    4200,
    CURRENT_DATE - INTERVAL '1 day',
    'Diesel refill'
),
(
    (SELECT id FROM vehicle.vehicles WHERE registration_number = 'KA01EF9012'),
    NULL,
    'Maintenance',
    3500,
    CURRENT_DATE,
    'Oil change service'
);

-- --------------------
-- REPORTING SCHEMA
-- --------------------

INSERT INTO reporting.fleet_metrics (
    metric_date,
    active_vehicles,
    available_vehicles,
    vehicles_in_maintenance,
    active_trips,
    fleet_utilization,
    total_operational_cost
) VALUES (
    CURRENT_DATE,
    3,
    2,
    1,
    1,
    75.50,
    13650
);

-- --------------------
-- NOTIFICATION SCHEMA
-- --------------------

INSERT INTO notification.notifications (
    recipient,
    subject,
    message,
    status,
    sent_at
) VALUES
(
    'michael.safety@transitops.com',
    'Driver License Expiry Reminder',
    'Driver Anita Sharma has a license expiring soon.',
    'Pending',
    NULL
),
(
    'john.manager@transitops.com',
    'Vehicle Maintenance Alert',
    'Vehicle Mini-07 is currently in maintenance.',
    'Sent',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);