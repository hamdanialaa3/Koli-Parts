BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE order_status AS ENUM (
  'DRAFT','PAYMENT_PENDING','PAYMENT_AUTHORIZED','PROCUREMENT_PENDING','PROCUREMENT_REVIEW',
  'PROCUREMENT_APPROVED','PROCUREMENT_STARTED','PROCUREMENT_CONFIRMED','SUPPLIER_OUT_OF_STOCK',
  'SUPPLIER_PRICE_CHANGED','MANUAL_REVIEW','FULFILLMENT_PENDING','SHIPPED','DELIVERED',
  'CANCELLED','RETURN_REQUESTED','REFUND_PENDING','REFUNDED','FAILED'
);
CREATE TYPE fitment_status AS ENUM ('CONFIRMED_FIT','HIGH_CONFIDENCE','VERIFY_OEM','UNKNOWN','NOT_COMPATIBLE');
CREATE TYPE payment_status AS ENUM ('PENDING','AUTHORIZED','CAPTURED','CANCELLED','FAILED','PARTIALLY_REFUNDED','REFUNDED');
CREATE TYPE procurement_status AS ENUM ('PENDING','REVIEW','APPROVED','STARTED','CONFIRMED','FAILED','CANCELLED');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  preferred_language varchar(5) NOT NULL DEFAULT 'bg',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX users_email_unique_active ON users (lower(email)) WHERE email IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE external_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_subject text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_subject)
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vin text,
  make text NOT NULL,
  model text NOT NULL,
  generation text,
  variant text,
  production_year int CHECK (production_year BETWEEN 1886 AND 2200),
  engine_code text,
  fuel_type text,
  power_kw int,
  transmission text,
  body_type text,
  drivetrain text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vehicles_user_idx ON vehicles(user_id);
CREATE INDEX vehicles_vin_idx ON vehicles(vin) WHERE vin IS NOT NULL;

CREATE TABLE vin_lookups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vin_hash text NOT NULL,
  provider text NOT NULL,
  normalized_data jsonb NOT NULL,
  raw_data jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(vin_hash, provider, fetched_at)
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  brand text,
  manufacturer text,
  canonical_title text NOT NULL,
  category_code text,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE product_identifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type text NOT NULL,
  value text NOT NULL,
  normalized_value text NOT NULL,
  source text,
  UNIQUE(product_id, type, normalized_value)
);
CREATE INDEX product_identifiers_lookup_idx ON product_identifiers(type, normalized_value);

CREATE TABLE sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier text NOT NULL,
  external_seller_id text NOT NULL,
  display_name text,
  feedback_percent numeric(6,3),
  feedback_count bigint,
  reliability_score numeric(6,3),
  list_status text NOT NULL DEFAULT 'WATCH',
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(supplier, external_seller_id)
);

CREATE TABLE supplier_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES sellers(id) ON DELETE SET NULL,
  supplier text NOT NULL,
  marketplace text,
  external_item_id text NOT NULL,
  source_url text,
  title text NOT NULL,
  source_language varchar(10),
  condition text,
  price_minor bigint NOT NULL CHECK (price_minor >= 0),
  currency char(3) NOT NULL,
  quantity int,
  shipping_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  available boolean NOT NULL DEFAULT true,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(supplier, marketplace, external_item_id)
);
CREATE INDEX supplier_listings_product_idx ON supplier_listings(product_id);
CREATE INDEX supplier_listings_available_idx ON supplier_listings(available, supplier);

CREATE TABLE listing_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_listing_id uuid NOT NULL REFERENCES supplier_listings(id) ON DELETE CASCADE,
  price_minor bigint NOT NULL,
  currency char(3) NOT NULL,
  shipping_minor bigint NOT NULL DEFAULT 0,
  available boolean NOT NULL,
  payload jsonb NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE fitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_criteria jsonb NOT NULL,
  source text NOT NULL,
  source_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX fitments_product_idx ON fitments(product_id);

CREATE TABLE fitment_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  source text NOT NULL,
  evidence_type text NOT NULL,
  strength numeric(6,3) NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE compatibility_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  status fitment_status NOT NULL,
  rule_score numeric(5,2) NOT NULL CHECK (rule_score BETWEEN 0 AND 100),
  calibrated_probability numeric(6,5),
  evidence_ids uuid[] NOT NULL DEFAULT '{}',
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  algorithm_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX compatibility_product_vehicle_idx ON compatibility_evaluations(product_id, vehicle_id, created_at DESC);

CREATE TABLE carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency char(3) NOT NULL DEFAULT 'EUR',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  supplier_listing_id uuid NOT NULL REFERENCES supplier_listings(id),
  vehicle_id uuid REFERENCES vehicles(id),
  quantity int NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(cart_id, supplier_listing_id, vehicle_id)
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  currency char(3) NOT NULL,
  subtotal_minor bigint NOT NULL,
  shipping_minor bigint NOT NULL,
  tax_minor bigint NOT NULL,
  margin_minor bigint NOT NULL,
  total_minor bigint NOT NULL,
  breakdown jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  quote_id uuid REFERENCES quotes(id),
  status order_status NOT NULL DEFAULT 'DRAFT',
  currency char(3) NOT NULL,
  total_minor bigint NOT NULL CHECK (total_minor >= 0),
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_user_idx ON orders(user_id, created_at DESC);
CREATE INDEX orders_status_idx ON orders(status, created_at);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  supplier_listing_id uuid REFERENCES supplier_listings(id),
  listing_snapshot_id uuid REFERENCES listing_snapshots(id),
  vehicle_id uuid REFERENCES vehicles(id),
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price_minor bigint NOT NULL,
  fitment_status fitment_status,
  fitment_evaluation_id uuid REFERENCES compatibility_evaluations(id)
);

CREATE TABLE order_events (
  id bigserial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_status order_status,
  to_status order_status,
  actor_type text NOT NULL,
  actor_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  provider text NOT NULL,
  provider_payment_id text NOT NULL,
  status payment_status NOT NULL,
  amount_minor bigint NOT NULL,
  currency char(3) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_payment_id)
);

CREATE TABLE payment_events (
  id bigserial PRIMARY KEY,
  payment_id uuid REFERENCES payments(id) ON DELETE CASCADE,
  provider_event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE procurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  supplier text NOT NULL,
  status procurement_status NOT NULL DEFAULT 'PENDING',
  external_order_id text,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE procurement_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procurement_id uuid NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
  attempt_no int NOT NULL,
  status text NOT NULL,
  request_fingerprint text,
  result jsonb,
  error_code text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(procurement_id, attempt_no)
);

CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  procurement_id uuid REFERENCES procurements(id),
  carrier text,
  tracking_number text,
  status text NOT NULL DEFAULT 'PENDING',
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tracking_events (
  id bigserial PRIMARY KEY,
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  external_event_id text,
  status text NOT NULL,
  location text,
  event_at timestamptz,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  reason_code text NOT NULL,
  status text NOT NULL,
  responsibility_code text,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  payment_id uuid REFERENCES payments(id),
  provider_refund_id text,
  amount_minor bigint NOT NULL,
  currency char(3) NOT NULL,
  status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE idempotency_keys (
  key text PRIMARY KEY,
  scope text NOT NULL,
  request_hash text NOT NULL,
  response_status int,
  response_body jsonb,
  resource_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  payload_hash text NOT NULL,
  payload jsonb NOT NULL,
  verified_at timestamptz,
  processed_at timestamptz,
  status text NOT NULL DEFAULT 'RECEIVED',
  retry_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  job_type text NOT NULL,
  status text NOT NULL,
  cursor text,
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  error jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  actor_type text NOT NULL,
  actor_id text,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  before_data jsonb,
  after_data jsonb,
  reason text,
  request_id text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_target_idx ON audit_logs(target_type, target_id, created_at DESC);

CREATE TABLE feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO feature_flags(key, enabled) VALUES
  ('DISABLE_EBAY_SYNC', false),
  ('DISABLE_AUTOMATIC_PROCUREMENT', true),
  ('DISABLE_CHECKOUT', false),
  ('DISABLE_NEW_ORDERS', false),
  ('DISABLE_PAYMENT_CAPTURE', false)
ON CONFLICT (key) DO NOTHING;

COMMIT;
