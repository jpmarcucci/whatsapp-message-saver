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
client.on('message_create', async (message) => {
    try {
        // Ignora Stories (STATUS) e do Prorio Bot
        if (message.from === 'status@broadcast') return;

        const isFromMe = message.fromMe;
        const chat = await message.getChat();
        const contato = await message.getContact();

        let identificador;
        let nomeExibicao;

        // Se a mensagem é sua (enviada)
        if (message.fromMe) {
            identificador = message.to; // destinatário
        } else {
            identificador = message.from; // quem enviou
        }
        // remove sufixo do WhatsApp
        identificador = identificador.replace(/@c\.us|@g\.us/g, '');

        if (isFromMe) {
            nomeExibicao = 'Eu';
        } else {
            nomeExibicao = contato.pushname || contato.number;
        }

        if (chat.isGroup) {
            const nomeGrupo = nomeSeguro(chat.name || 'grupo');
            identificador = `grupo_${nomeGrupo}`;
            nomeExibicao = `${nomeExibicao} (grupo: ${chat.name})`;
        }

        const texto = message.body || '';
        const dataHora = new Date().toLocaleString();
        const dataHoje = getDataFormatada();

        // Estrutura de pasta
        const baseDir = path.join(__dirname, 'mensagens', dataHoje, identificador);
        fs.mkdirSync(baseDir, { recursive: true });
        const filePath = path.join(baseDir, 'mensagens.txt');

        let log = `[${dataHora}] ${nomeExibicao}: ${texto}`;

        const nomeFilePath = path.join(baseDir, 'nomecontato.txt');
        // só salva se NÃO for mensagem sua
        if (!isFromMe) {
            if (!fs.existsSync(nomeFilePath)) {
                fs.writeFileSync(nomeFilePath, nomeExibicao);
            }
        }

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