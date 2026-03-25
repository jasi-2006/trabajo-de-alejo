const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyecto_sena'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL');

  db.query(`
    CREATE TABLE IF NOT EXISTS personas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefono VARCHAR(20),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Error creando tabla:', err.message);
    else console.log('✅ Tabla personas lista');
  });
});

// GET - Obtener todos los registros
app.get('/api/personas', (req, res) => {
  db.query('SELECT * FROM personas ORDER BY fecha DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST - Crear registro
app.post('/api/personas', (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  db.query(
    'INSERT INTO personas (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
    [nombre, apellido, email, telefono],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre, apellido, email, telefono, fecha: new Date() });
    }
  );
});

// DELETE - Eliminar registro
app.delete('/api/personas/:id', (req, res) => {
  db.query('DELETE FROM personas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Registro eliminado' });
  });
});

app.listen(5000, () => console.log('🚀 Backend en puerto 5000'));
