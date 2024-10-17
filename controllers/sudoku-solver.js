class SudokuSolver {

  // 檢查 puzzleString 是否只有有效的字符，並且長度為 81
  validate(puzzleString) {
    // 先檢查字串長度是否為 81
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    // 再檢查是否只有數字 1-9 或 "." 代表空格
    const validChars = /^[1-9\.]+$/;
    if (!validChars.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }

    return { valid: true };
  }

  // 檢查數字在行中的放置是否有效
  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let i = 0; i < 9; i++) {
      if (i !== column) {
        const cellValue = puzzleString[rowStart + i];
        if (cellValue === value) {
          return false;
        }
      }
    }
    return true;
  }

  // 檢查數字在列中的放置是否有效
  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i !== row) {
        const cellValue = puzzleString[i * 9 + column];
        if (cellValue === value) {
          return false;
        }
      }
    }
    return true;
  }

  // 檢查數字在 3x3 區域中的放置是否有效
  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let r = regionRow; r < regionRow + 3; r++) {
      for (let c = regionCol; c < regionCol + 3; c++) {
        if (r !== row || c !== column) {
          const cellValue = puzzleString[r * 9 + c];
          if (cellValue === value) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // 解題邏輯，使用遞迴回溯法
  solve(puzzleString) {
    // 先檢查拼圖字串的有效性
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error }; // 返回具體的錯誤訊息
    }

    // 將字串轉換為陣列以便操作
    const puzzleArray = puzzleString.split('');

    // 使用遞迴來解拼圖
    const solveRecursive = (puzzle) => {
      const emptyIndex = puzzle.indexOf('.');
      if (emptyIndex === -1) {
        return puzzle.join(''); // 解題完成，返回完整拼圖
      }

      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle.join(''), row, col, value) &&
          this.checkColPlacement(puzzle.join(''), row, col, value) &&
          this.checkRegionPlacement(puzzle.join(''), row, col, value)
        ) {
          puzzle[emptyIndex] = value;
          const result = solveRecursive(puzzle);
          if (result) {
            return result; // 找到解答，返回結果
          }
          puzzle[emptyIndex] = '.'; // 回溯
        }
      }
      return false; // 無法解題，返回 false
    };

    const result = solveRecursive(puzzleArray);
    if (!result) {
      return { error: 'Puzzle cannot be solved' }; // 拼圖無法解答，返回提示
    }

    return { solution: result }; // 返回解答結果
  }
}

module.exports = SudokuSolver;
