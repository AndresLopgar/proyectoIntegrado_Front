const express = require('express');
const path = requiere('path');

const app = express();

app.use(express.static('./dist/proyectoIntegrado_front'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: './dist/proyectoIntegrado_front/'}),
);

app.listen(process.env.PORT || 8081);