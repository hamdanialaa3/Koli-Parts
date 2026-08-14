provider "google" {
  project = var.project_id
  region  = var.region
}

# Skeleton only: choose actual managed container platform after ADR-010.
# Recommended MVP direction on GCP: Cloud Run + Cloud SQL + Memorystore + Secret Manager.

resource "google_service_account" "api" {
  account_id   = "koliparts-api-${var.environment}"
  display_name = "Koli Parts API ${var.environment}"
}

resource "google_secret_manager_secret" "app_config" {
  secret_id = "koliparts-app-config-${var.environment}"
  replication { auto {} }
}
