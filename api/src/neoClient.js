const neo4j = require('neo4j-driver');
const waitOn = require('wait-on');
const { NEO4J_HOST, NEO4J_PORT } = require('./config');

const uri = `bolt://${NEO4J_HOST}:${NEO4J_PORT}`;

const driverPromise = new Promise((acc, rej) => {
    waitOn({
        resources: [`tcp:${NEO4J_HOST}:${NEO4J_PORT}`],
        delay: 100,
        timeout: 15000,
    }).then(() => acc(neo4j.driver(uri)));
});

module.exports = {
    withSession: async fn => {
        const driver = await driverPromise;
        const session = driver.session();
        try {
            return await fn(session);
        } finally {
            session.close();
        }
    },
    withWriteTransaction: async fn => {
        const driver = await driverPromise;
        const session = driver.session();
        try {
            await session.writeTransaction(async transaction => {
                await fn(transaction);
            });
        } finally {
            session.close();
        }
    },
};
