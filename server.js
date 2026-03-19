const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = 3000;

const BASE_DIR = path.join(__dirname, 'mensagens');

const urlorigin = process.env.CORS_URL;

function caminhoSeguro(base, alvo) {
    const resolved = path.resolve(base, alvo);
    if (!resolved.startsWith(base)) {
        throw new Error('Acesso inválido');
    }
    return resolved;
}

// CORS (ajuste se quiser liberar só localhost)
app.use(cors({
    origin: urlorigin
}));

app.use(express.static('public'));

app.use(express.json());

// Dias
app.get('/dias', (req, res) => {
    if (!fs.existsSync(BASE_DIR)) return res.json([]);

    const dias = fs.readdirSync(BASE_DIR);
    res.json(dias);
});

// Contatos
app.get('/contatos/:dia', (req, res) => {
    try {
        const dir = caminhoSeguro(BASE_DIR, req.params.dia);

        if (!fs.existsSync(dir)) return res.json([]);

        res.json(fs.readdirSync(dir));
    } catch {
        res.status(400).json({ erro: 'Caminho inválido' });
    }
});

// Mensagens
app.get('/mensagens/:dia/:contato', (req, res) => {
    try {
        const file = caminhoSeguro(
            BASE_DIR,
            `${req.params.dia}/${req.params.contato}/mensagens.txt`
        );

        if (!fs.existsSync(file)) return res.send('');

        res.send(fs.readFileSync(file, 'utf-8'));
    } catch {
        res.status(400).json({ erro: 'Caminho inválido' });
    }
});

// Nome do contato
app.get('/nome/:dia/:contato', (req, res) => {
    try {
        const file = caminhoSeguro(
            BASE_DIR,
            `${req.params.dia}/${req.params.contato}/nomecontato.txt`
        );

        if (!fs.existsSync(file)) {
            return res.send(req.params.contato);
        }

        res.send(fs.readFileSync(file, 'utf-8'));
    } catch {
        res.status(400).json({ erro: 'Caminho inválido' });
    }
});

// Arquivos (protegido)
app.get('/arquivos/:dia/:contato/:arquivo', (req, res) => {
    try {
        const file = caminhoSeguro(
            BASE_DIR,
            `${req.params.dia}/${req.params.contato}/${req.params.arquivo}`
        );

        res.sendFile(file);
    } catch {
        res.status(400).json({ erro: 'Acesso inválido' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});