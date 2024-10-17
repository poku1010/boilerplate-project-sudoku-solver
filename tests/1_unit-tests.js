const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  
  // 測試：處理有效的 81 字符的 puzzle 字串
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.validate(puzzle);
    assert.isTrue(result.valid);
  });

  // 測試：處理包含無效字符的 puzzle 字串 (非1-9或.)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9....Z6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.validate(puzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  // 測試：處理長度非 81 的 puzzle 字串
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'; // 80 字符
    const result = solver.validate(puzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  // 測試：處理有效的行放置
  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkRowPlacement(puzzle, 0, 1, '3');
    assert.isTrue(result);
  });

  // 測試：處理無效的行放置
  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkRowPlacement(puzzle, 0, 1, '5'); // 行中已經有 5
    assert.isFalse(result);
  });

  // 測試：處理有效的列放置
  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkColPlacement(puzzle, 0, 1, '3');
    assert.isTrue(result);
  });

  // 測試：處理無效的列放置
  // Test: Logic handles an invalid column placement
  test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkColPlacement(puzzle, 0, 1, '2'); // Column already has '2'
    assert.isFalse(result);
  });
  

  // 測試：處理有效的區域放置
  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkRegionPlacement(puzzle, 0, 1, '9');
    assert.isTrue(result);
  });

  // 測試：處理無效的區域放置
  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5..9.....4....1....8.3...6.5....9..1....8..79...6.34.6...8..';
    const result = solver.checkRegionPlacement(puzzle, 0, 1, '2'); // 區域中已經有 2
    assert.isFalse(result);
  });

  // 測試：有效的 puzzle 字串應通過解題器
  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = solver.solve(puzzle);
    assert.isString(solution.solution);
  });

  // 測試：無效的 puzzle 字串應失敗
  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = solver.solve(puzzle);
    assert.equal(solution.error, 'Invalid characters in puzzle');
  });

  // 測試：解題器應返回預期解答
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const solution = solver.solve(puzzle);
    assert.equal(solution.solution, expectedSolution);
  });

});
