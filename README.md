# 📦 WhatsApp Message Saver

Uma solução **self-hosted** para realizar backup em tempo real de
mensagens do WhatsApp, com suporte a múltiplos tipos de mídia e
visualização via interface web.

## 🚀 Visão Geral

Este projeto foi desenvolvido para capturar e armazenar mensagens do
WhatsApp em tempo real, criando um histórico confiável e de fácil
acesso.

Ele utiliza o **WhatsApp Web** como base de integração, o que reduz
significativamente as chances de bloqueio --- embora não as elimine
completamente.

## ✨ Funcionalidades

-   📩 Captura de mensagens em tempo real\
-   🖼️ Suporte a múltiplos tipos de mídia:
    -   Texto
    -   Imagens
    -   Áudios
    -   Vídeos
    -   Documentos\
-   💾 Armazenamento local (self-hosted)\
-   🌐 Interface web para visualização das mensagens\
-   🔄 Estrutura simples e extensível

## 🐳 Como Rodar (Docker)

``` bash
docker compose up -d
```

## 🔐 Primeiro Acesso (Autenticação)

1.  Abra o WhatsApp no celular\
2.  Vá em **Dispositivos conectados**\
3.  Clique em **Conectar dispositivo**\
4.  Escaneie o QR Code exibido no terminal

## 💾 Persistência de Dados

-   `.wwebjs_auth` → Sessão autenticada\
-   `.wwebjs_cache` → Cache da conexão\
-   `mensagens/` → Mensagens e mídias

## ⚙️ Funcionamento

Após a autenticação:

-   O bot inicia automaticamente\
-   Escuta novas mensagens em tempo real\
-   Salva tudo no diretório `mensagens/`

⚠️ **Importante:** não baixa mensagens antigas.

## 🌐 Visualizador

http://localhost:8080

## ⚠️ Observações

-   Usa WhatsApp Web (não API oficial)\
-   Existe baixo risco de bloqueio

## 🤝 Contribuição

Contribuições são bem-vindas!