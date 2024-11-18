#!/bin/sh

# Set default LOG_LEVEL if not set
LOG_LEVEL=${LOG_LEVEL:-debug}

# Evaluate debug mode based on LOG_LEVEL
if [ "$LOG_LEVEL" = "debug" ] || [ "$LOG_LEVEL" = "trace" ]; then
    export KRATOS_DEBUG_MODE=true
else
    export KRATOS_DEBUG_MODE=false
fi

# Construct SMTP connection URI
if [ "$SMTP_SECURE" = "true" ]; then
    SMTP_PROTOCOL="smtps://"
    SMTP_SSL_VERIFY="?skip_ssl_verify=true"
else
    SMTP_PROTOCOL="smtp://"
    SMTP_SSL_VERIFY=""
fi

# Add credentials if provided
if [ -n "$SMTP_USER" ] || [ -n "$SMTP_PASS" ]; then
    SMTP_CREDENTIALS="${SMTP_USER}:${SMTP_PASS}@"
else
    SMTP_CREDENTIALS=""
fi

# Export the constructed SMTP URI
export SMTP_URI="${SMTP_PROTOCOL}${SMTP_CREDENTIALS}${SMTP_HOST}:${SMTP_PORT}/${SMTP_SSL_VERIFY}"
echo "SMTP_URI: $SMTP_URI"

# Set default values for email settings if not provided
export SMTP_FROM_ADDRESS=${SMTP_FROM:-no-reply@kairos.local}
export SMTP_FROM_NAME=${SMTP_FROM_NAME:-Kairos}

# Generate the configuration file from template
envsubst < /etc/config/kratos/kratos.template.yml > /etc/config/kratos/kratos.yml

# Execute the original command
exec "$@"
