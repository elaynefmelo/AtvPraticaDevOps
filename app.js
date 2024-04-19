const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(':memory:');

// Criar tabela para armazenar informações
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS informacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER, cidade TEXT)");
});

// Middleware para permitir o uso de JSON no corpo da solicitação
app.use(express.json());

// Rota para criar uma nova entrada
app.post('/informacoes', (req, res) => {
  const { nome, idade, cidade } = req.body;
  if (!nome || !idade || !cidade) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos!' });
  }

  db.run("INSERT INTO informacoes (nome, idade, cidade) VALUES (?, ?, ?)", [nome, idade, cidade], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar entrada no banco de dados.' });
    }
    res.status(201).json({ id: this.lastID, nome, idade, cidade });
  });
});

// Rota para listar todas as entradas
app.get('/informacoes', (req, res) => {
  db.all("SELECT * FROM informacoes", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar informações do banco de dados.' });
    }
    res.json(rows);
  });
});

// Rota para exibir as informações no navegador
app.get('/', (req, res) => {
  res.send(`
    <h1>Dados Armazenados</h1>
    <ul>
      <li><a href="/informacoes">Visualizar Informações</a></li>
    </ul>
  `);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
