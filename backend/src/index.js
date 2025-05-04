require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configurado corretamente
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true,
}));

app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
console.log('[DEBUG] Tipo de authRoutes:', typeof authRoutes);
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Porta
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
