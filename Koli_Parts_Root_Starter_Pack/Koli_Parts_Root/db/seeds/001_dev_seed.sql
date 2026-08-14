-- Development-only seed. Never run automatically in production.
INSERT INTO products (slug, brand, canonical_title, category_code)
VALUES ('demo-maf-opel-astra-j', 'DEMO', 'Demo Mass Air Flow Sensor', 'ENGINE_AIR')
ON CONFLICT (slug) DO NOTHING;
