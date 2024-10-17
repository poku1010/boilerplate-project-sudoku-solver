const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  // 測試：用有效 puzzle 字串解題
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isString(res.body.solution);
        assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
        done();
      });
  });

  // 測試：缺少 puzzle 字串
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  // 測試：包含無效字符的 puzzle 字串
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    const puzzle = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // 測試：長度錯誤的 puzzle 字串
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'; // 80 字符
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // 測試：無法解決的 puzzle
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    const puzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // 測試：檢查拼圖放置，提供所有必要欄位
  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '6' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });

  // 測試：單一放置衝突
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ['row']); // 修正為 ['row']
        done();
      });
  });

  // 測試：多個放置衝突
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column']);
        done();
      });
  });

  // 測試：所有放置衝突
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '9' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  // 測試：缺少必要欄位
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, value: '5' }) // 缺少 coordinate
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  // 測試：無效字符的拼圖放置
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    const puzzle = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // 測試：長度錯誤的拼圖放置
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'; // 80 字符
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // 測試：無效的坐標
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'Z9', value: '5' }) // 無效坐標
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  // 測試：無效的放置值
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '0' }) // 無效值
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});
