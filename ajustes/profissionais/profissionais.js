import { sendGet, toggleModal, carregarSelect, sendDelete, sendPost, sendPut } from '../../utils.js';

const form = document.getElementById('formProfissionais');
const btNovo = document.getElementById('novoProfissional');
const btcadastrar = document.getElementById('cadastarProfissional');
const btvoltar = document.getElementById('btVoltarModal');
const table = document.getElementById('tableProfissionais');
const tableTbody = document.getElementById('tableProfissionais').getElementsByTagName('tbody')[0];  
let isEdit = false;
let editId = null;

async function AbrirModal(mode, profisional = '', setor = '') {
    toggleModal('modal', true);
    isEdit = (mode === 1);
    profissionalInput.value = profisional;
    profissionalInput.focus();
    await carregarSelect('/setores', 'setoresSelect', 'id', 'setor');
    if (isEdit) {
        setoresSelect.value = setor;
    }
}

function FecharModal() {
    toggleModal('modal', false);
    form.reset();
    isEdit = false;
    editId = null;
}

btNovo.addEventListener('click', () => AbrirModal(0));
btvoltar.addEventListener('click', FecharModal);
btcadastrar.addEventListener('click', Cadastrar);

document.addEventListener('DOMContentLoaded', async function () {
    await carregarProfissionais();
});

async function carregarProfissionais() {
    const chave = localStorage.getItem('chaveConectada');
    const response = await sendGet('/profissionais/' + chave);
    if (response) {
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        for (let i = 0; i < response.length; i++) {
            const item = response[i];
            const row = tableTbody.insertRow();
            row.onclick = function () {
                AbrirModal(1, item.profissional, item.id_setor);
                editId = item.id;
            };
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            cell1.innerHTML = item.id;
            cell2.innerHTML = item.profissional;
            const data = await sendGet('/setores/' + chave + '/' + item.id_setor)
            if (data) {
                cell3.innerHTML = data[0].setor
            } else {
                console.log('erro aqui')
            }
            const trashIcon = document.createElement('img');
            trashIcon.src = "../../img/trash.png";
            trashIcon.alt = "excluir";
            trashIcon.onclick = function (event) {
                event.stopPropagation();
                Deletar(item.id);
            };
            cell4.appendChild(trashIcon);
        }
    } else {
        alert('Erro ao carregar profissionais!');
        console.log(response.json());
    }
}

async function Cadastrar(event) {
    event.preventDefault();
    if (form.checkValidity()) {
        let response = null
        const profissional = profissionalInput.value;
        const id_setor = setoresSelect.value;
        const chave = localStorage.getItem('chaveConectada');
        const usuario = localStorage.getItem('usuarioConectado');
        const data = {
            chave,
            profissional,
            id_setor,
            usuario,
        };
        if (isEdit) {
            response = await sendPut('/profissionais/' + editId, data);
        } else {
            response = await sendPost('/profissionais', data);
        }
        if (response) {
            carregarProfissionais();
            toggleModal('modal', false);
        } else {
            alert('Erro ao cadastrar/editar profissional no banco de dados!');
            toggleModal('modal', false);
        }
    } else {
        form.reportValidity();
    }
}

async function Deletar(id) {
    const confirmacao = confirm('Você tem certeza que deseja apagar esse profissional?');
    if (confirmacao) {
        const usuario = localStorage.getItem('usuarioConectado');
        const data = { usuario };
        const response = await sendDelete('/profissionais/' + id, data);
        if (response) {
            carregarProfissionais();
        } else {
            alert('Erro ao deletar profissional no banco de dados!');
        }
    }
}
