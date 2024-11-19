FROM oryd/kratos:v1.3.1

USER root
RUN apk add --no-cache gettext
RUN mkdir -p /etc/config/kratos
COPY ./config/kratos/generate-config.sh /etc/config/kratos/
COPY ./config/kratos/kratos.template.yml /etc/config/kratos/
COPY ./config/kratos/identity.schema.json /etc/config/kratos/
COPY ./config/kratos/webhook-body.jsonnet /etc/config/kratos/
COPY ./.docker/auth/start.sh /start.sh
RUN chmod +x /etc/config/kratos/generate-config.sh && \
    chmod +x /start.sh && \
    chown -R ory:ory /etc/config/kratos && \
    chown ory:ory /start.sh

USER ory

ENTRYPOINT ["/start.sh"]
