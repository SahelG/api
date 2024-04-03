import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const port = 8080;
const app = express();

app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync('./data.json');
        return JSON.parse(data);
    }catch(error) {
        console.log(error);
        return { refacciones: [] };
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./data.json', JSON.stringify(data));
    }catch(error) {
        console.log(error);
    }
}

app.get('/', (req, res) => {
    res.send('Ruta de inicio de la api');
});

app.get('/refacciones', (req, res) => {
    const data = readData();
    res.json(data.refacciones);
});

app.get('/refacciones/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const refaccion = data.refacciones.find((refaccion) => refaccion.id === id);
    res.json(refaccion);
});

app.post('/refacciones', (req, res) => {
    const data = readData();
    const body = req.body;
    const newRefaccion = {
        id: data.refacciones.length + 1,
        ...body,
    };
    data.refacciones.push(newRefaccion);
    writeData(data);
    res.json(newRefaccion);
});

app.put('/refacciones/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const refaccionIndex = data.refacciones.findIndex((refaccion) => refaccion.id === id);
    data.refacciones[refaccionIndex] = {
        ...data.refacciones[refaccionIndex],
        ...body,
    };

    writeData(data);
    res.json({ message: "Spare part updated successfully."})
});

app.delete('/refacciones/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const sparePartIndex = data.refacciones.findIndex((refaccion) => refaccion.id === id);
    data.refacciones.splice(sparePartIndex, 1);
    writeData(data);
    res.json({ message: "Spare part deleted successfully" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});