
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.produtos);
});

router.post('/', (req, res) => {
  const db = readDB();
  const novoProduto = {
    id: Date.now(),
    nome: req.body.nome,
    preco: req.body.preco
  };
  db.produtos.push(novoProduto);
  writeDB(db);
  res.status(201).json(novoProduto);
});

router.put('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.produtos.findIndex(p => p.id === id);

  if (index !== -1) {
    db.produtos[index] = { id, ...req.body };
    writeDB(db);
    res.json(db.produtos[index]);
  } else {
    res.status(404).json({ mensagem: 'Produto não encontrado' });
  }
});

router.delete('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.produtos = db.produtos.filter(p => p.id !== id);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
