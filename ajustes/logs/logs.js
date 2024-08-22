import { sendGet } from "../../utils.js";

const table = document.querySelector('#tableLogs tbody');
const select = document.getElementById('operacaoSelect');

select.addEventListener('change', carregarLogs);
document.addEventListener('DOMContentLoaded', carregarLogs);

async function carregarLogs() {
    const chave = localStorage.getItem('chaveConectada');
    const data = await sendGet(`/logs/${chave}`);
    if (!data) throw new Error('Erro ao carregar logs!');
    let filteredData = data;
    if (select.value !== 'Todos') {
        filteredData = data.filter(log => log.procedimento === select.value);
    }
    table.innerHTML = '';
    filteredData.forEach(item => {
        const row = table.insertRow();
        row.innerHTML = `
                <td>${item.procedimento}</td>
                <td>${new Date(item.timestamp).toLocaleDateString('pt-BR')} às ${new Date(item.timestamp).toLocaleTimeString('pt-BR')}</td>
                <td>${item.usuario}</td>
                <td>${item.log}</td>
            `;
    });
}
