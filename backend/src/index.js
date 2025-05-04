require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// (1) no topo, opcional: um logger simples
app.use(morgan('dev'));

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// Rotas
const authRoutes = require('./routes/authRoutes');
console.log('[DEBUG] Tipo de authRoutes:', typeof authRoutes);
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes)

// Global error handler
app.use((err, req, res, next) => {
  console.error('🛑 ERRO NO BACKEND:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno no servidor' });
});

// ——————————————————————————————————————————
// (2) middleware global de erro, **depois de todas as rotas**
app.use((err, req, res, next) => {
  console.error('🛑 ERRO NO BACKEND:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor'
  });
});

// Porta
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
