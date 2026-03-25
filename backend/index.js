const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// REEMPLAZA ESTA URL con la que te dio MongoDB Atlas (Connect -> Drivers)
const mongoURI = "mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/mi_proyecto?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema de registro de personas
const PersonaSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  fecha: { type: Date, default: Date.now }
});
const Persona = mongoose.model('Persona', PersonaSchema);

// GET - Obtener todos los registros
app.get('/api/personas', async (req, res) => {
  const personas = await Persona.find().sort({ fecha: -1 });
  res.json(personas);
});

// POST - Crear registro
app.post('/api/personas', async (req, res) => {
  const persona = new Persona(req.body);
  await persona.save();
  res.json(persona);
});

// DELETE - Eliminar registro
app.delete('/api/personas/:id', async (req, res) => {
  await Persona.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Registro eliminado' });
});

app.listen(5000, () => console.log("🚀 Backend en puerto 5000"));