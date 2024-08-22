import { sendDelete, sendGet, sendPost, sendPut, toggleModal } from "../../utils.js"

const modal = document.getElementById('modal')
const form = document.getElementById('formSetores')
const btNovo = document.getElementById('novoSetor')

const setorInput = document.getElementById('setorInput')
const btcadastrar = document.getElementById('cadastarSetor')
const btvoltar = document.getElementById('btVoltarModal')

const table = document.getElementById('tableSetores')
const tableTbody = document.getElementById('tableSetores').getElementsByTagName('tbody')[0]

let isEdit = false;
let editId = null;

function AbrirModal(mode, setor = '') {
    toggleModal('modal', true)
    isEdit = (mode === 1);
    setorInput.value = setor;
    setorInput.focus()
}

function FecharModal() {
    toggleModal('modal', false)
    form.reset()
    isEdit = false;
    editId = null;
}

btNovo.addEventListener('click', () => AbrirModal(0));
btvoltar.addEventListener('click', FecharModal)
btcadastrar.addEventListener('click', Cadastrar)

document.addEventListener('DOMContentLoaded', async function () {
    await carregarSetores()
});

async function carregarSetores() {
    const chave = localStorage.getItem('chaveConectada');
    const response = await sendGet('/setores/' + chave);
    if (response) {
        const data = response;
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const row = tableTbody.insertRow();
            row.onclick = function () {
                AbrirModal(1, item.setor);
                editId = item.id;
            };
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.innerHTML = item.id;
            cell2.innerHTML = item.setor;
            const trashIcon = document.createElement('img');
            trashIcon.src = "../../img/trash.png";
            trashIcon.alt = "excluir";
            trashIcon.onclick = function (event) {
                event.stopPropagation();
                Deletar(item.id);
            };
            cell3.appendChild(trashIcon);
        }
    } else {
        alert('Erro ao carregar setores!');
        console.log(response.json());
    }
}

async function Cadastrar(event) {
    event.preventDefault();
    let response = null;
    if (form.checkValidity()) {
        const setor = setorInput.value
        const chave = localStorage.getItem('chaveConectada')
        const usuario = localStorage.getItem('usuarioConectado')
        const data = { chave, setor, usuario, }

        if (isEdit) {
            response = await sendPut('/setores/' + editId, data)
        } else {
            response = await sendPost('/setores', data)
        }
        if (response) {
            carregarSetores()
            toggleModal('modal', false)
        } else {
            alert('Erro ao cadastrar/editar setor no banco de dados!')
            toggleModal('modal', false)
        }
    } else {
        form.reportValidity()
    }
}

async function Deletar(id) {
    const confirmacao = confirm('Você tem certeza que deseja apagar esse setor?')
    if (confirmacao) {
        const usuario = localStorage.getItem('usuarioConectado')
        const data = {
            usuario,
        }
        const response = await sendDelete('/setores/' + id, data)
        if (response) {
            carregarSetores()
        } else {
            alert('Erro ao deletar setor no banco de dados!')
        }
    }
}
