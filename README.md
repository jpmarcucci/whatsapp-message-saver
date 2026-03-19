# Whatsapp Message Saver

Esse projeto foi desenvolvido para ser um backup em tempo real de mensagens do WhatsApp. Por utilizar o site oficial do WhatsApp as chances de bloqueio são pequenas porém não nulas.  

Suporta o download de mensagen, imagens, audio, video e documentos.  

Inclui um visualizador de mensagens.  

# Como rodar
docker compose up -d

# Manual
No primeiro uso será solicitado a leitura do QR Code. 
No aplicativo do WhatsApp -> Dispositivos Conectados -> Conectar Dispositivo.

Para persistir a sessão são utilizados os diretórios .wwebjs_auth e .wwebjs_cache  

Para persistir as mensagens é utilizado o diretório "mensagens".  

Depois de feita a conexão o BOT começará a ouvir o WhatsApp e assim que uma mensagem chegar será salvo no diretoŕio "mensagens". Por enquanto não faz download das mensagens antigas.  