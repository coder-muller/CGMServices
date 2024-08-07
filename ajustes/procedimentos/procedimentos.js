// procedimentos.js
const modal = document.getElementById('modal')
const form = document.getElementById('formProcedimento')
const btNovo = document.getElementById('novoProcedimento')

const procedimentoInput = document.getElementById('procedimentoInput')
const btcadastrar = document.getElementById('cadastarProcedimento')
const btvoltar = document.getElementById('btVoltarModal')

const table = document.getElementById('tableProcedimentos')
const tableTbody = document.getElementById('tableProcedimentos').getElementsByTagName('tbody')[0]

let isEdit = false;
let editId = null;

function AbrirModal(mode, procedimento = '') {
    modal.style.display = 'block'
    isEdit = (mode === 1);
    procedimentoInput.value = procedimento;
    btcadastrar.textContent = isEdit ? 'Editar' : 'Cadastrar';
}

function FecharModal() {
    modal.style.display = 'none'
    form.reset()
    isEdit = false;
    editId = null;
    btcadastrar.textContent = 'Cadastrar';
}

btNovo.addEventListener('click', () => AbrirModal(0));
btvoltar.addEventListener('click', FecharModal)
btcadastrar.addEventListener('click', Cadastrar)

document.addEventListener('DOMContentLoaded', async function () {
    await carregarProcedimentos()
});

async function carregarProcedimentos() {
    const chave = localStorage.getItem('chaveConectada');
    try {
        const response = await fetch('http://localhost:4567/procedimentos/' + chave);
        if ((await response).ok) {
            const data = await response.json();
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const row = tableTbody.insertRow();
                row.onclick = function () {
                    AbrirModal(1, item.procedimento);
                    editId = item.id;
                };
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                cell1.innerHTML = item.id;
                cell2.innerHTML = item.procedimento;
                cell3.innerHTML = '<img src="../../img/trash.png" alt="edição" onclick="Deletar(' + item.id + ')">'
            }
        } else {
            alert('Erro ao carregar procedimentos!');
            console.log(response.json());
        }
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar procedimentos!');
    }
}

async function Cadastrar(event) {
    event.preventDefault();
    if (form.checkValidity()) {
        try {
            const procedimento = procedimentoInput.value
            const chave = localStorage.getItem('chaveConectada')
            const usuario = localStorage.getItem('usuarioConectado')
            const data = {
                chave,
                procedimento,
                usuario,
            }
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? 'http://localhost:4567/procedimentos/' + editId : 'http://localhost:4567/procedimentos';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                carregarProcedimentos()
                modal.style.display = 'none'
            } else {
                alert('Erro ao cadastrar/editar procedimento no banco de dados!')
                modal.style.display = 'none'
            }
        } catch (error) {
            console.error(error)
        }
    } else {
        form.reportValidity()
    }
}

async function Deletar(id) {
    const confirmacao = confirm('Você tem certeza que deseja apagar esse procedimento?')
    if (confirmacao) {
        try {
            const usuario = localStorage.getItem('usuarioConectado')
            const data = {
                usuario,
            }
            const response = await fetch('http://localhost:4567/procedimentos/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                carregarProcedimentos()
            } else {
                alert('Erro ao deletar procedimento no banco de dados!')
            }
        } catch (error) {
            console.error(error)
        }
    }
}
