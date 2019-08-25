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

window.findNRooksSolution = _.memoize(function(n, i) {
  if (i === undefined) {
    i = 0;
  }
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[1]];
  }
  //console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return this._findNRooksSolution(this.findNRooksSolution(n - 1), i);
});

// var fibonacci = _.memoize(function(n) {
//   return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
// });

window._findNRooksSolution = function(previousSolution, i) {
  // [[1,0],[0,1]]
  // return nxn+1 board with last column empty
  // [[1,0],[0,1]]
  var newSolution = previousSolution.slice();
  newSolution.forEach(function(row) {
    row.push(0); // [[1,0,0],[0,1,0]]
  });
  var _generateRowPiece = function(n) {
    // return a row with a piece toggled at the last column
    var row = [];
    for (var i = 0; i < n; i++) {
      row.push(0);
    }
    row[row.length - 1] = 1; //flip the last one
    return row;
  };
  var movableRow = _generateRowPiece(previousSolution.length + 1);
  newSolution.splice(i, 0, movableRow);
  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return newSolution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window._allNRooksSolutions = function(n) {
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[[1]]];
  }
  var solutions = [];
  for (var i = 0; i < n; i++) {
    debugger;
    _allNRooksSolutions(n - 1).forEach(function(solution) {
      // only one solution [[1]]
      solutions.push(this._findNRooksSolution(solution, i)); // pushes _findNRooksSolution([[1]],0) then _findNRooksSolution([[1]],1)
    });
  }
  return solutions;
};

window.countNRooksSolutions = function(n) {
  var allSol = this._allNRooksSolutions(n);
  console.log('Number of solutions for ' + n + ' rooks:', allSol.length);
  return allSol.length;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log(
    "Single solution for " + n + " queens:",
    JSON.stringify(solution)
  );
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log("Number of solutions for " + n + " queens:", solutionCount);
  return solutionCount;
};
