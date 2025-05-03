require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
// Aqui você vai importar e usar as rotas reais da aplicação:
const authRoutes = require('./routes/authRoutes');
console.log('[DEBUG] Tipo de authRoutes:', typeof authRoutes);
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Porta definida no .env ou padrão
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
