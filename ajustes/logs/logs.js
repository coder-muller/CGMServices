const table = document.querySelector('#tableLogs tbody');
const select = document.getElementById('operacaoSelect');

document.addEventListener('DOMContentLoaded', carregarLogs);

async function carregarLogs() {
    const chave = localStorage.getItem('chaveConectada');
    if (!chave) return alert('Chave não encontrada!');

    try {
        const response = await fetch(`http://localhost:4567/logs/${chave}`);
        if (!response.ok) throw new Error('Erro ao carregar logs!');

        const data = await response.json();
        table.innerHTML = '';

        data.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.procedimento}</td>
                <td>${new Date(item.timestamp).toLocaleDateString('pt-BR')} às ${new Date(item.timestamp).toLocaleTimeString('pt-BR')}</td>
                <td>${item.usuario}</td>
                <td>${item.log}</td>
            `;
        });
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
