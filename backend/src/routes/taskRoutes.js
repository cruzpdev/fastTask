const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middleware/authMiddleware');

// Buscar todas as listas do usuário autenticado
router.get('/listas', verificarToken, (req, res) => {
  const userId = req.usuarioId;
  db.query('SELECT * FROM listas WHERE usuario_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar listas' });
    res.json(results);
  });
});

// Buscar todas as tarefas de uma lista
router.get('/listas/:id/tarefas', verificarToken, (req, res) => {
  const listaId = req.params.id;
  db.query('SELECT * FROM tarefas WHERE lista_id = ?', [listaId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar tarefas' });
    res.json(results);
  });
});

// Buscar uma tarefa específica
router.get('/tarefas/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM tarefas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar tarefa' });
    if (results.length === 0) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.json(results[0]);
  });
});

// Criar uma nova tarefa
router.post('/tarefas', verificarToken, (req, res) => {
  const { titulo, descricao, dataVencimento, prioridade = 'media', listaId } = req.body;
  db.query(
    'INSERT INTO tarefas (titulo, descricao, dataVencimento, prioridade, lista_id, posicao, concluida) VALUES (?, ?, ?, ?, ?, 0, false)',
    [titulo, descricao || '', dataVencimento || null, prioridade, listaId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao criar tarefa' });
      db.query('SELECT * FROM tarefas WHERE id = ?', [result.insertId], (e, r) => {
        if (e) return res.status(500).json({ message: 'Erro ao retornar nova tarefa' });
        res.status(201).json(r[0]);
      });
    }
  );
});

// Atualizar uma tarefa
router.put('/tarefas/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const { titulo, descricao, concluida, dataVencimento, prioridade, posicao } = req.body;
  db.query(
    `UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ?, dataVencimento = ?, prioridade = ?, posicao = ? WHERE id = ?`,
    [titulo, descricao, concluida, dataVencimento, prioridade, posicao, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao atualizar tarefa' });
      db.query('SELECT * FROM tarefas WHERE id = ?', [id], (e, r) => {
        if (e) return res.status(500).json({ message: 'Erro ao retornar tarefa atualizada' });
        res.json(r[0]);
      });
    }
  );
});

// Excluir uma tarefa
router.delete('/tarefas/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tarefas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir tarefa' });
    res.status(204).end();
  });
});

// Alterar status de tarefa
router.patch('/tarefas/:id/status', verificarToken, (req, res) => {
  const id = req.params.id;
  const { concluida } = req.body;
  db.query(
    'UPDATE tarefas SET concluida = ? WHERE id = ?',
    [concluida, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao alterar status' });
      db.query('SELECT * FROM tarefas WHERE id = ?', [id], (e, r) => {
        if (e) return res.status(500).json({ message: 'Erro ao retornar tarefa' });
        res.json(r[0]);
      });
    }
  );
});

// Reordenar tarefas em uma lista
router.post('/listas/:id/tarefas/reordenar', verificarToken, (req, res) => {
  const listaId = req.params.id;
  const { tarefaId, novaPosicao } = req.body;

  db.query(
    'UPDATE tarefas SET posicao = ? WHERE id = ? AND lista_id = ?',
    [novaPosicao, tarefaId, listaId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao reordenar tarefa' });
      res.status(200).json({ message: 'Reordenado com sucesso' });
    }
  );
});

// Buscar todas as tarefas do usuário (para o calendário)
router.get('/tarefas', verificarToken, (req, res) => {
  const usuarioId = req.usuarioId;
  db.query(
    `SELECT t.* FROM tarefas t 
     JOIN listas l ON t.lista_id = l.id 
     WHERE l.usuario_id = ?`,
    [usuarioId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar tarefas' });
      res.json(results);
    }
  );
});

module.exports = router;
