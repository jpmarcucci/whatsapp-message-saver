const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Função para formatar data (YYYY-MM-DD)
function getDataFormatada() {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
}

// Gera nome único de arquivo de media
function gerarNomeArquivo(ext) {
    return `media_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
}

// Evento de mensagem
client.on('message', async (message) => {
    try {
        // Ignora Stories (STATUS) e do Prorio Bot
        if (message.from === 'status@broadcast') return;
        if (message.fromMe) return;

        const chat = await message.getChat();
        const contato = await message.getContact();

        const numero = contato.number;
        const nomeContato = contato.pushname || contato.name || numero;

        // Se for grupo
        const identificador = numero;
        const nomeExibicao = nomeContato;

        if (chat.isGroup) {
            const nomeGrupo = nomeSeguro(chat.name || 'grupo');
            identificador = `grupo_${nomeGrupo}`;
            nomeExibicao = `${nomeContato} (grupo: ${chat.name})`;
        }

        const texto = message.body || '';
        const dataHora = new Date().toLocaleString();

        // Estrutura de pasta
        const dataHoje = getDataFormatada();
        const baseDir = path.join(__dirname, 'mensagens', dataHoje, identificador);

        fs.mkdirSync(baseDir, { recursive: true });

        const filePath = path.join(baseDir, 'mensagens.txt');

        let log = `[${dataHora}] ${nomeExibicao}: ${texto}`;

        // Salva nome do contato
        const nomeFilePath = path.join(baseDir, 'nomecontato.txt');

        // Sempre atualiza (caso o nome mude)
        fs.writeFileSync(nomeFilePath, nomeContato);

        // Se for media
        if (message.hasMedia) {
            const media = await message.downloadMedia();

            if (media) {
                const mimeType = media.mimetype;
                const tipo = mimeType.split('/')[0];
                const ext = mimeType.split('/')[1].split(';')[0];

                const nomeArquivo = gerarNomeArquivo(ext);
                const caminhoArquivo = path.join(baseDir, nomeArquivo);

                const buffer = Buffer.from(media.data, 'base64');
                fs.writeFileSync(caminhoArquivo, buffer);

                log += ` [${tipo.toUpperCase()}: ${nomeArquivo}]`;
            } else {
                log += ` [ERRO AO BAIXAR MÍDIA]`;
            }
        }

        log += '\n';

        fs.appendFile(filePath, log, (err) => {
            if (err) {
                console.error('Erro ao salvar:', err);
            } else {
                console.log('Mensagem Salva:', log.trim());
            }
        });
    } catch (erro) {
        console.error('Erro ao processar mensagem:', erro);
    }
});

client.initialize();