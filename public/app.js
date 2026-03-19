async function carregar() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    const resDias = await fetch('/dias');
    if (!resDias) return;

    const dias = await resDias.json();

    for (let dia of dias.reverse()) {
        const resContatos = await fetch(`/contatos/${dia}`);
        if (!resContatos) continue;

        const contatos = await resContatos.json();

        for (let contato of contatos) {
            let nome = contato;

            const resNome = await fetch(`/nome/${dia}/${contato}`);
            if (resNome) nome = await resNome.text();

            const div = document.createElement('div');
            div.className = 'item';
            div.innerText = nome;

            div.onclick = () => abrirChat(dia, contato, nome);

            lista.appendChild(div);
        }
    }
}

async function abrirChat(dia, contato, nome) {
    document.getElementById('titulo').innerText = nome;

    const res = await fetch(`/mensagens/${dia}/${contato}`);
    if (!res) return;

    const texto = await res.text();

    const container = document.getElementById('mensagens');
    container.innerHTML = '';

    const linhas = texto.split('\n');

    linhas.forEach(linha => {
        if (!linha.trim()) return;

        const div = document.createElement('div');
        div.className = 'msg';

        const regex = /\[(.*?)\]/g;
        let textoLimpo = linha;
        let match;

        while ((match = regex.exec(linha)) !== null) {
            const conteudo = match[1];

            if (conteudo.includes('media_')) {
                const nomeArquivo = conteudo.split(': ')[1];

                const link = document.createElement('a');
                link.href = `/arquivos/${dia}/${contato}/${nomeArquivo}`;
                link.innerText = '📎 Abrir arquivo';
                link.target = '_blank';
                link.className = 'file-link';

                textoLimpo = textoLimpo.replace(match[0], '');

                div.innerText = textoLimpo;
                div.appendChild(link);
                container.appendChild(div);
                return;
            }
        }

        div.innerText = linha;
        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

carregar();