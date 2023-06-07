const { createHash } = require("./utils");
const { withWriteTransaction } = require("./neoClient");

// const BOARD_SLOTS = [
//            0, 
//          1, 2,
//         3, 4, 5,
//       6, 7, 8, 9,
//    10, 11, 12, 13, 14
// ];

const VALID_MOVES = [  // [ Jump over, land in ]
  /* 00 */ [ [1, 3], [2, 5] ],
  /* 01 */ [ [4, 8], [3, 6] ],
  /* 02 */ [ [4, 7], [5, 9] ],
  /* 03 */ [ [1, 0], [6, 10], [7, 12], [4, 5] ],
  /* 04 */ [ [7, 11], [8, 13] ],
  /* 05 */ [ [2, 0], [9, 14], [8, 12], [4, 3] ],
  /* 06 */ [ [3, 1], [7, 8] ],
  /* 07 */ [ [4, 2], [8, 9] ],
  /* 08 */ [ [4, 1], [7, 6] ],
  /* 09 */ [ [5, 2], [8, 7] ],
  /* 10 */ [ [6, 3], [11, 12] ],
  /* 11 */ [ [7, 4], [12, 13] ],
  /* 12 */ [ [7, 3], [8, 5], [13, 14], [11, 10] ],
  /* 13 */ [ [8, 4], [12, 11] ],
  /* 14 */ [ [9, 5], [13, 12] ],
];

function printBoard(board) {
  const hash = createHash(board);
  console.log(JSON.stringify(board));
  const p = (slot) => slot ? "*" : "o";

  console.log(`Board hash: ${hash}`);
  console.log(`       ${p(board[0])}       `);
  console.log(`      ${p(board[1])} ${p(board[2])}      `);
  console.log(`    ${p(board[3])}  ${p(board[4])}  ${p(board[5])}    `);
  console.log(`   ${p(board[6])}  ${p(board[7])} ${p(board[8])}  ${p(board[9])}   `);
  console.log(`  ${p(board[10])} ${p(board[11])}  ${p(board[12])}  ${p(board[13])} ${p(board[14])}  `);
}

function determineNextSteps(board) {
  const nextBoards = [];

  for (let i = 0; i < board.length; i++) {
    // Skip slot if no peg is in it
    if (!board[i]) continue;

    const validMoves = VALID_MOVES[i];
    for (let j = 0; j < validMoves.length; j++) {
      const move = validMoves[j];
      if (board[move[0]] && !board[move[1]]) {
        const nextBoard = [...board];
        nextBoard[i] = false;
        nextBoard[move[0]] = false;
        nextBoard[move[1]] = true;

        const nextMove = { from: i, to: move[1], removed: move[0], board: nextBoard };
        nextBoards.push(nextMove);
      }
    }
  }

  return nextBoards;
}

async function runOnce(printStatus = false) {
  await withWriteTransaction(async tx => {
    const startingBoardQuery = await tx.run(
      `MATCH (b:Board) WHERE NOT EXISTS(b.processed) RETURN b`,
    );

    if (printStatus)
      console.log(`There are ${startingBoardQuery.records.length} unprocessed boards`);

    if (startingBoardQuery.records.length === 0)
      return;

    const node = startingBoardQuery.records[0].get(0).properties;
    const startingBoard = JSON.parse(node.state);

    // printBoard(startingBoard);
    const nextBoards = determineNextSteps(startingBoard);
    // console.log(`Found ${nextBoards.length} next boards`);

    for (let i = 0; i < nextBoards.length; i++) {
      const { board, to, from } = nextBoards[i];
      const newHash = createHash(board);

      const resultBoard = await tx.run(
        `MATCH (b:Board {hash: $newHash}) RETURN b`,
        {
          newHash: newHash,
        }
      );

      if (resultBoard.records.length === 0) {
        await tx.run(
          'MERGE (b:Board { hash : $hash, state: $state, numPegs: $numPegs})',
          {
            hash: newHash,
            state: JSON.stringify(board),
            numPegs: board.reduce((p, c) => (c) ? p + 1: p, 0),
          }
        );
      }
      
      const resultRelationship = await tx.run(
        `MATCH path=(b:Board {hash: $oldHash})-[:MOVES]->(b2:Board { hash: $newHash}) RETURN path`,
        {
          newHash: newHash,
          oldHash: node.hash,
        }
      );

      if (resultRelationship.records.length === 0) {
        await tx.run(
          'MATCH (b:Board { hash: $oldHash }), (b2:Board {hash: $newHash}) MERGE (b)-[:MOVES {to: $to, from: $from, description: $description}]->(b2)',
          {
            oldHash: node.hash,
            to, from,
            newHash,
            description: `${from} to ${to}`,
          }
        );
      }

      // printBoard(board)
    }

    await tx.run(
      'MATCH (b:Board { hash: $oldHash }) SET b.processed="true"',
      {
        oldHash: node.hash,
      }
    );
  });
}

async function run(numBoards) {
  console.log("Populating starting positions");
  await withWriteTransaction(async tx => {
    for (let i = 0; i < 15; i++) {
      const boardState = Array(15).fill(true);
      boardState[i] = false;

      const boardHash = createHash(boardState);
      await tx.run(
        `MERGE (b:Board { hash: $hash, state: $state, numPegs: 14 })`,
        {
          hash: boardHash,
          state: JSON.stringify(boardState),
        }
      )
    }
  });
  console.log("Done populating starting positions");


  for (let i = 0; i < numBoards; i++) {
    await runOnce(i % 100 === 0);
    if (i % 100 === 0)
      console.log(`Completed evaulating ${i} boards`);
  }
  console.log("And done");
}

module.exports = {
  populate: run,
};