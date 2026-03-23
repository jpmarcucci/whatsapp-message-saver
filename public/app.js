async function carregar() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    const res = await fetch('/contatos');
    if (!res) return;

    const contatos = await res.json();

    for (let contato of contatos) {
        let nome = contato;

        const resNome = await fetch(`/nome/${contato}`);
        if (resNome) nome = await resNome.text();

        const div = document.createElement('div');
        div.className = 'item';
        div.innerText = nome;

        div.onclick = () => abrirChat(contato, nome);

        lista.appendChild(div);
    }
}

async function abrirChat(contato, nome) {
    document.getElementById('titulo').innerText = nome;

    const res = await fetch(`/mensagens/${contato}`);
    if (!res) return;

    const texto = await res.text();

    const container = document.getElementById('mensagens');
    container.innerHTML = '';

    const linhas = texto.split('\n');

    linhas.forEach(linha => {
        if (!linha.trim()) return;

        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = formatarMensagem(linha);

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

function formatarMensagem(linha) {
    const regex = /\[ARQUIVO:(.*?)\]/g;

    return linha.replace(regex, (_, caminho) => {
        const url = `/arquivos/${caminho}`;
        const nome = caminho.split('/').pop();

        return `<a href="${url}" target="_blank">📎 ${nome}</a>`;
    });
}
carregar();