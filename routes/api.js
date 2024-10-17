'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  // 檢查數字在特定位置是否有效
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // 檢查是否提供所有必須的參數
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // 檢查 puzzle 字串的有效性
      const validation = solver.validate(puzzle);
      if (!validation.valid) {
        return res.json({ error: validation.error });
      }

      // 驗證坐標
      if (!/^[A-I][1-9]$/i.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // 驗證值
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate.toUpperCase().charCodeAt(0) - 65; // A -> 0, B -> 1, ...
      const column = parseInt(coordinate[1], 10) - 1;

      // 忽略當前位置的值
      const currentValue = puzzle[row * 9 + column];
      if (currentValue !== '.' && currentValue === value) {
        return res.json({ valid: true });
      }

      // 執行行、列、區域的檢查
      const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
      const colValid = solver.checkColPlacement(puzzle, row, column, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);

      const conflicts = [];
      if (!rowValid) conflicts.push('row');
      if (!colValid) conflicts.push('column');
      if (!regionValid) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });
    
  // 解數獨
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // 檢查是否提供 puzzle 字串
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      if (result.error) {
        return res.json({ error: result.error });
      }

      return res.json({ solution: result.solution });
    });
};
