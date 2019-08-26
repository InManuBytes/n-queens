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
  // we use memoize so it remembers the previous solution
  if (i === undefined) {
    i = 0;
  }
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[1]];
  }
  solution = this._findNRooksSolution(this.findNRooksSolution(n - 1), i);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
});

// This uses the previous solution or the solution for an n-1 board
// so we can use it recursively as the previous function is super useful in this case
window._findNRooksSolution = function(previousSolution, i) {
  // for n = 2 previous Solution = [[1]]
  var newSolution = previousSolution.slice();
  newSolution.forEach(function(row) {
    row.push(0); // return nxn+1 board with last column empty // [[1,0]]
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
  var movableRow = _generateRowPiece(previousSolution.length + 1); // [[0,1]]
  newSolution.splice(i, 0, movableRow); // insert in our nxn+1 matrix at row i [[0,1],[1,0]] or [[1,0],[0,1]]
  return newSolution;
};

// See the following visualization for the thought behind this solution:
// https://projects.invisionapp.com/freehand/document/EG3WZin5r
// it does not use any of our helper functions and does not have to check non-working solutions
// we can do this because of the fact that the count should be n!
window._allNRooksSolutions = function(n) {
  // n = 2
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[[1]]];
  }
  var solutions = [];
  for (var i = 0; i < n; i++) {
    this._allNRooksSolutions(n - 1).forEach(function(solution) {
      // only one solution [[1]]
      solutions.push(this._findNRooksSolution(solution, i)); // pushes _findNRooksSolution([[1]],0) then _findNRooksSolution([[1]],1)
    });
  }
  return solutions;
};

var _generateRowPiece = function (n) {
  // return a row with a piece toggled at the last column
  var row = [];
  for (var i = 0; i < n; i++) {
    row.push(0);
  }
  row[row.length - 1] = 1; //flip the last one
  return row;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var allSol = this._allNRooksSolutions(n);
  console.log('Number of solutions for ' + n + ' rooks:', allSol.length);
  return allSol.length;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
// an easy solution would be to place queens "knight" moves away
// which means that solutions start for n >= 4
// we can think of it as that each queen actually "occupies" a 2x1 board of space
// as represented by the x's plus the row and column (represented by -)
// [x Q x -]
// [x x x 0]
// [0 - 0 0]
// [0 - 0 0]
// then you'd want that space to overlap with other queens placed
// [x Q x -]
// [x x x Q]
// [0 - x x]
// [0 - 0 -]
// A 3x3 can only fit 2 queens because it cannot fit 2 2x1s inside and still leave enough room for other queens
// [x Q x ] once you place one queen the only two spaces left are on the same row
// [x x x ]
// [0 - 0 ]
window.findNQueensSolution = function(n) {
  var solutionBoard = new Board({ n: n });
  var solution = solutionBoard.rows();
  // first we generate a 1D array of length n with n integers
  var oneDArray = [];
  if (n > 0) {
    for (var i = 0; i < n; i++) {
      oneDArray.push(i);
    }
    // then we get all the permutations and loop over them
    this._getAllNumberPermutations(oneDArray).forEach(function(permutation) {
      // generate a board from each permutation
      var board = _getBoard(permutation);
      // check if it has queens conflict
      // and grab the first that doesn't
      if (!board.hasAnyQueensConflicts()) {
        solution = board.rows();
      }
    });
  }
  console.log(
    'Single solution for ' + n + ' queens:',
    JSON.stringify(solution)
  );
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
// since we obviously can't place two queens on the same row
// one thing to note is that no two numbers can be the same
// we can think of board solutions as represented by 1 dimensional arrays
// so that a board like
// [0 1 0 0]
// [0 0 0 1]
// [1 0 0 0]
// [0 0 1 0]
// would be represented by [2,0,3,1] where the numbers represent the column at each row
// ie this is a problem of permutations of 0 to n-1 (or n integers)
// so we need a way to generate the permutations
// generate a board from the permutations
// and check for queen conflicts on that board
// if there are none we increase the count
window.countNQueensSolutions = function(n) {
  debugger;
  var solutionCount = (!n) ? 1 : 0;
  // first we generate a 1D array of length n with n integers
  var oneDArray = [];
  for (var i = 0; i < n; i++) {
    oneDArray.push(i);
  }
  // then we get all the permutations and loop over them
  this._getAllNumberPermutations(oneDArray).forEach(function(permutation) {
    // generate a board from each permutation
    var board = _getBoard(permutation);
    // check if it has queens conflict
    // and grab the first that doesn't
    if (!board.hasAnyQueensConflicts()) {
      solutionCount++;
    }
  });
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

// permutations of 0 to n-1 numbers
// generate an array filled with numbers from 0 to n-1?
// [0,1,2]
// this is acutally very similar to the same question as the rockPaperScissors question for n rounds
// without repeating ... in order to not repeat we can use recursion
// we loop over the array
// choosing each one
// then recursively call the permutations on the rest of the array
// this is similar to what we did _allNRooksSolutions
var _getAllNumberPermutations = function(numbersArray) {
  // [0,1]
  var perms = [];
  // base case is when there's only one number left in the array
  if (numbersArray.length === 1) {
    perms.push(numbersArray);
    return perms;
  }
  for (var i = 0; i < numbersArray.length; i++) {
    // i = 0; i = 1
    var firstNumber = [numbersArray[i]]; // [0]; [1]
    var numbersLeft = numbersArray
      .slice(0, i)
      .concat(numbersArray.slice(i + 1)); // [1], [0]
    _getAllNumberPermutations(numbersLeft).forEach(function(perm) {
      // _getAllNumberPermutations([1]) = [[1]]; _getAllNumberPermutations([0]) = [[0]]
      perms.push(firstNumber.concat(perm)); // [0].concat([1]) = [0,1]; [1].concat([0]) = [1,0]
    });
  }
  return perms;
};

//function to generate a board given a one dimensional array
window._getBoard = function(permutation) {
  //[2,0,3,1] where the numbers represent the column at each row
  // we loop over the array and we know that the index is the rowIdx and the element is the columnIdx
  var n = permutation.length;
  var newBoard = new Board({ n: n });
  for (var i = 0; i < n; i++) {
    newBoard.togglePiece(i, permutation[i]);
  }
  return newBoard;
};
