/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = new Board({n: n}); // create an empty board
  var rooksLeft = n;
  for (var i = 0; i < n; i++) {
    var currentRow = solution.get(i); // check row by row
    for (var j = 0; j < n; j++) {
      if (currentRow[j] === 0) { // if there's no piece there we have to check for conflicts
        solution.hasColConflictAt(j);
        solution.togglePiece(i, j);
        rooksLeft--;
        break; //skip row
      }
    }
  }

  // use toggle piece to place first piece
  // put first piece on [0][0]
  // [x - -]
  // [- 0 0]
  // [- 0 0]
  // skip to next row
  // [x 0 0]
  // [0 x 0]
  // [0 0 0]
  // skip to next row
  // [x 0 0]
  // [0 x 0]
  // [0 0 x]
  // we need to be able to put n number of rooks

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
