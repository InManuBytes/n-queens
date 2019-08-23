// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {
  window.Board = Backbone.Model.extend({
    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log(
          'Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:'
        );
        console.log(
          '\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
        console.log(
          '\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    // returns each row as an array
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)
        ) ||
        this.hasMinorDiagonalConflictAt(
          this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex)
        )
      );
    },

    hasAnyQueensConflicts: function() {
      return (
        this.hasAnyRooksConflicts() ||
        this.hasAnyMajorDiagonalConflicts() ||
        this.hasAnyMinorDiagonalConflicts()
      );
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex &&
        rowIndex < this.get('n') &&
        0 <= colIndex &&
        colIndex < this.get('n')
      );
    },

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict

    //specs don't test this function
    hasRowConflictAt: function(rowIndex) {
      var _currentRow = this.get(rowIndex); //this is an array
      var _ones = 0;
      for (let i = 0; i < _currentRow.length; i++) {
        if (_currentRow[i] === 1) {
          _ones++;
        }
      }
      if (_ones > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // get all rows and loop over with hasRowConflictAt
      // just need to loop through rowIndexes -> n of them
      var result = false;
      for (let i = 0; i < this.attributes.n; i++) {
        if (this.hasRowConflictAt(i) === true) {
          result = true;
        }
      }
      return result;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict

    // returns a transposed board
    _transBoard: function() {
      var wholeBoard = this.rows();
      var size = this.attributes.n;
      var columnsArray = [];
      for (var i = 0; i < size; i++) {
        var column = [];
        for (var j = 0; j < size; j++) {
          column.push(wholeBoard[j][i]);
        }
        columnsArray.push(column);
      }
      var transBoard = new Board(columnsArray);
      return transBoard;
    },
    hasColConflictAt: function(colIndex) {
      var transBoard = this._transBoard();
      return transBoard.hasRowConflictAt(colIndex);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var transBoard = this._transBoard();
      return transBoard.hasAnyRowConflicts(); // fixme
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // get the whole board
      var _wholeBoard = this.rows();
      var _size = this.attributes.n;
      var _piecesCount = 0;
      // a spot with index i,j on the board is referenced by wholeBoard[i][j]
      var j = majorDiagonalColumnIndexAtFirstRow;
      // since we're going from top-left to bottom-right we start at row 0
      // loop through i, j index increasing both by one to check diagonal
      //
      // Example:
      // [0,0,0,0]
      // [0,0,0,0]
      // [0,0,0,1]
      // [0,0,0,0]
      //
      // so say we start at j = 1
      // start at wholeBoard[0][1]
      // [0,x,0,0]  next  [0,0,0,0]
      // [0,0,0,0] i=1,j=2[0,0,x,0]
      // [0,0,0,1]        [0,0,0,1]
      // [0,0,0,0]        [0,0,0,0]

      for (var i = 0; j < _size; i++, j++) {
        if (_wholeBoard[i][j] === 1) {
          _piecesCount++;
        }
      }
      return _piecesCount > 1; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var _size = this.attributes.n;
      var conflict = false;
      var transBoard = this._transBoard();
      for (var i = 0; i < _size; i++) {
        if (
          this.hasMajorDiagonalConflictAt(i) ||
          transBoard.hasMajorDiagonalConflictAt(i)
        ) {
          conflict = true;
        }
      }
      return conflict;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row = 0) {
      // get the whole board
      var _wholeBoard = this.rows();
      var _size = this.attributes.n;
      var _piecesCount = 0;
      // a spot with index i,j on the board is referenced by wholeBoard[i][j]
      var j = minorDiagonalColumnIndexAtFirstRow;
      if (j > _size - 1) {
        return 'Invalid input';
      }
      // we want to make sure we're not trying to access indexes off the board
      for (var i = row; j > -1 && i < _size; i++, j--) {
        if (_wholeBoard[i][j] === 1) {
          _piecesCount++;
        }
      }
      return _piecesCount > 1;
      // Example:
      // [0,0,x,0]
      // [0,0,0,0]
      // [0,0,0,1]
      // [0,0,0,0]
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // run hasMinorDiagonalConflictAt run through first row
      // that will cover right-top half of the board including the longest minor diagonal
      // Example:
      // [x,x,x,x] 0
      // [x,x,x,0]
      // [x,x,0,0] n-1
      // [x,0,0,0] n
      var _size = this.attributes.n;
      var conflict = false;
      for (var i = 0; i < _size; i++) {
        // if there is a minor diagonal conlfict return true
        if (this.hasMinorDiagonalConflictAt(i)) {
          conflict = true;
        }
      }
      //check the last column for minor diagonals starting at i = 1, j=_size-1 => i=_size-1
      for (var i = 1; i < _size - 1; i++) {
        var columnIdx = _size - 1;
        if (this.hasMinorDiagonalConflictAt(columnIdx, i)) {
          conflict = true;
        }
      }

      return conflict;
    }

    /*--------------------  End of Helper Functions  ---------------------*/
  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
})();
