const table = document.getElementById('tableLogs').getElementsByTagName('tbody')[0]
const select = document.getElementById('operacaoSelect')

document.addEventListener('DOMContentLoaded', async function () {
    await carregarLogs()
});

async function carregarLogs() {
    const chave = localStorage.getItem('chaveConectada')
    try {
        const response = await fetch('http://localhost:4567/logs/' + chave)
        if ((await response).ok) {
            const data = await response.json()
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                const row = table.insertRow()
                const cell1 = row.insertCell(0)
                const cell2 = row.insertCell(1)
                const cell3 = row.insertCell(2)
                const cell4 = row.insertCell(3)
                cell1.innerHTML = item.procedimento
                cell2.innerHTML = `${new Date(item.timestamp).toLocaleDateString('pt-BR')} às ${new Date(item.timestamp).toLocaleTimeString('pt-BR')}` 
                cell3.innerHTML = item.usuario
                cell4.innerHTML = item.log
            }
        } else {
            alert('Erro ao carregar logs!')
            console.log(response.json())
        }
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar logs!')
    }
}