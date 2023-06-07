FROM alpine AS apoc
ARG APOC_VERSION=4.3.0.0
WORKDIR /plugins
ADD https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/${APOC_VERSION}/apoc-${APOC_VERSION}-all.jar /plugins/apoc-${APOC_VERSION}-all.jar
RUN chmod a+r -R /plugins

FROM neo4j:4.4-community
COPY --from=apoc /plugins /plugins
ENV NEO4J_AUTH=none
RUN --mount=type=bind,source=data.dump,target=/tmp/data.dump \
    neo4j-admin load --from=/tmp/data.dump