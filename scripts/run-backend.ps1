$ErrorActionPreference = "Stop"

function Require-Env($name) {
  $val = [Environment]::GetEnvironmentVariable($name)
  if ([string]::IsNullOrWhiteSpace($val)) {
    throw "Missing required environment variable: $name"
  }
}

Require-Env "DATABASE_JDBC_URL"
Require-Env "DATABASE_USERNAME"
Require-Env "DATABASE_PASSWORD"
Require-Env "JWT_SECRET_BASE64"

Push-Location (Join-Path $PSScriptRoot "..\\backend")
try {
  .\\mvnw.cmd spring-boot:run
} finally {
  Pop-Location
}





