const express = require("express");
const { withSession } = require("./neoClient");
const { populate } = require("./populate");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "HI THERE" });
});

app.get("/api/boards/:hash", (req, res) => {
  getBoardInfo(req.params.hash, res)
    .catch(e => {
      console.error(e);
      res.status(500).send({ error: e })
    });
});

app.get("/api/populate", (req, res) => {
  populate(req.query.numBoards || 3000)
    .then(() => res.send({ complete: true }))
    .catch((e) => res.status(500).send({ error: e }));
});

async function getBoardInfo(hash, res) {
  await withSession(async (session) => {
    const boardStateResult = await session.run(
      `MATCH (b:Board {hash:'${hash}'}) RETURN b`,
    );

    if (boardStateResult.records.length === 0) {
      return res.status(404).send({ message : "Requested board not found" });
    }

    const pathsToOneQuery = await session.run(
      `MATCH path=(b:Board {hash:'${hash}'})-[:MOVES*]->(b2:Board {numPegs: 1}) RETURN path`
    );

    const pathsToOne = [];
    pathsToOneQuery.records.forEach(record => {
      let node = pathsToOne.find(r => r.hash === record._fields[0].segments[0].end.properties.hash);
      if (!node) {
        node = { 
          hash: record._fields[0].segments[0].end.properties.hash,
          state: record._fields[0].segments[0].end.properties.state,
          count: 0,
          description: record._fields[0].segments[0].relationship.properties.description,
        }
        pathsToOne.push(node);
      }

      node.count++;
    });

    // console.log(JSON.stringify(pathsToOne.records, null, 2));

    res.send({ paths: { toOne : pathsToOne }, ...boardStateResult.records[0].get(0).properties });
  });
}

app.listen(3000, () => console.log("Listening on port 3000"));
