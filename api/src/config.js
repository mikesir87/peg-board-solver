const fs = require('fs');

module.exports = {
    NEO4J_HOST: getValue('NEO4J_HOST', 'neo4j'),
    NEO4J_PORT: getValue('NEO4J_PORT', '7687'),
};

function getValue(envName, defaultValue) {
    return process.env[envName] ? process.env[envName] : defaultValue;
}
