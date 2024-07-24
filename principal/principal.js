const conteudo = document.getElementById('conteudo');

const btAgenda = document.getElementById('btAgenda');
const btClientes = document.getElementById('btClientes');
const btResultados = document.getElementById('btResultados');
const btAjustes = document.getElementById('btAjustes');


btAgenda.addEventListener('click', () => carregarConteudoHTML('../agenda/agenda.html'));
btClientes.addEventListener('click', () => carregarConteudoHTML('../clientes/clientes.html'));
btResultados.addEventListener('click', () => carregarConteudoHTML('../resultados/resultados.html'));
btAjustes.addEventListener('click', () => carregarConteudoHTML('../ajustes/ajustes.html'));

function carregarConteudoHTML(pagina) {
    const iframe = document.createElement('iframe');
    iframe.src = pagina;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    conteudo.innerHTML = '';
    conteudo.appendChild(iframe);
}

document.addEventListener('DOMContentLoaded', () => carregarConteudoHTML('../agenda/agenda.html'));

