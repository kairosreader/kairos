#!/bin/sh
set -e

# Generate Kratos configuration from template
/etc/config/kratos/generate-config.sh

# Run database migrations
kratos -c /etc/config/kratos/kratos.yml migrate sql -e --yes

# Start Kratos server
exec kratos serve -c /etc/config/kratos/kratos.yml --watch-courier
