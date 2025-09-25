const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "reservas.json");

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function lerReservas() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function salvarReservas(reservas) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(reservas, null, 2));
}

app.get("/reservas", (req, res) => {
    res.json(lerReservas());
});

app.post("/reservas", (req, res) => {
    const reservas = lerReservas();
    reservas.push(req.body);
    salvarReservas(reservas);
    res.json({ message: "Reserva adicionada com sucesso!" });
});

app.delete("/reservas/:index", (req, res) => {
    const reservas = lerReservas();
    const index = parseInt(req.params.index);
    if (index >= 0 && index < reservas.length) {
        reservas.splice(index, 1);
        salvarReservas(reservas);
        res.json({ message: "Reserva removida com sucesso!" });
    } else {
        res.status(400).json({ error: "Índice inválido" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

