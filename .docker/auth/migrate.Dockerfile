FROM oryd/kratos:v1.3.1

USER root
RUN apk add --no-cache gettext
RUN mkdir -p /etc/config/kratos
COPY ./config/kratos/generate-config.sh /etc/config/kratos/
COPY ./config/kratos/kratos.template.yml /etc/config/kratos/
COPY ./config/kratos/identity.schema.json /etc/config/kratos/
COPY ./config/kratos/webhook-body.jsonnet /etc/config/kratos/
RUN chmod +x /etc/config/kratos/generate-config.sh && \
    chown -R ory:ory /etc/config/kratos

USER ory

# Set the entrypoint to generate config and run migrations
ENTRYPOINT ["sh", "-c", "generate-config.sh && kratos -c /etc/config/kratos/kratos.yml migrate sql -e --yes"]
