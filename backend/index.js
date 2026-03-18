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

// Definir qué vamos a guardar (un esquema simple de tareas)
const Task = mongoose.model('Task', { nombre: String });

// Endpoint 1: Obtener datos (GET)
app.get('/api/tareas', async (req, res) => {
  const tareas = await Task.find();
  res.json(tareas);
});

// Endpoint 2: Guardar datos (POST) - Esta es la operación en BD que pide el requisito
app.post('/api/tareas', async (req, res) => {
  const nuevaTarea = new Task({ nombre: req.body.nombre });
  await nuevaTarea.save();
  res.json(nuevaTarea);
});

app.listen(5000, () => console.log("🚀 Backend en puerto 5000"));