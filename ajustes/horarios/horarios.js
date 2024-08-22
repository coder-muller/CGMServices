import { sendGet, sendPost, sendPut, sendDelete, carregarSelect, toggleModal } from '../../utils.js';

const btNovo = document.getElementById('novoHorario')
const selectDiaForm = document.getElementById('selectDiaForm')
let isEdit = false;
let editId = null;

const form = document.getElementById('formHorario')
const btCadastrar = document.getElementById('cadastarHorario')
const btSairModal = document.getElementById('btVoltarModal')

const table = document.getElementById('tableHorarios')
const tbody = document.getElementById('tableHorarios').getElementsByTagName('tbody')[0]

btCadastrar.addEventListener('click', CadastrarHorario)
btNovo.addEventListener('click', () => toggleModal('modal', true))
btSairModal.addEventListener('click', FecharModal)
selectDiaForm.addEventListener('change', carregarTabela);

document.addEventListener('DOMContentLoaded', async function () {
    await carregarTabela()
    await carregarSelect('/setores', 'selectSetor', 'id', 'setor');
    IMask(document.getElementById('hInicio'), {
        mask: 'HH:MM',
        blocks: {
            HH: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 23,
                maxLength: 2
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59,
                maxLength: 2
            }
        }
    });
    IMask(document.getElementById('hTermino'), {
        mask: 'HH:MM',
        blocks: {
            HH: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 23,
                maxLength: 2
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59,
                maxLength: 2
            }
        }
    });
});

function AbrirModalEdit(item) {
    isEdit = true;
    toggleModal('modal', true)
    if (item) {
        editId = item.id;
        document.getElementById('selectSetor').value = item.id_setor;
        document.getElementById('selectDia').value = item.dia;
        document.getElementById('hInicio').value = item.h_inicio;
        document.getElementById('hTermino').value = item.h_termino;
        document.getElementById('demanda').value = item.demanda;
    }
}
function FecharModal(event) {
    if (event) {
        event.preventDefault()
    }
    isEdit = false;
    form.reset()
    toggleModal('modal', false)
}

async function carregarTabela() {
    const chave = localStorage.getItem('chaveConectada');
    const data = await sendGet('/horarios/' + chave);

    if (data) {
        data.sort((a, b) => b.id_setor - a.id_setor);
        const diaSelecionado = document.getElementById('selectDiaForm').value;
        const dadosFiltrados = data.filter(item => item.dia === diaSelecionado);
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        for (let i = 0; i < dadosFiltrados.length; i++) {
            const item = dadosFiltrados[i];
            const row = tbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);
            const dataSetores = await sendGet('/setores/' + chave + '/' + item.id_setor);
            if (dataSetores) {
                cell1.innerHTML = dataSetores[0].setor;
            }
            cell2.innerHTML = item.h_inicio;
            cell3.innerHTML = item.h_termino;
            cell4.innerHTML = item.demanda;
            const editIcon = document.createElement('img');
            editIcon.src = "../../img/pencil.png";
            editIcon.alt = "editar";
            editIcon.onclick = function (event) {
                event.stopPropagation();
                AbrirModalEdit(item);
            };
            cell5.appendChild(editIcon);
            const trashIcon = document.createElement('img');
            trashIcon.src = "../../img/trash.png";
            trashIcon.alt = "excluir";
            trashIcon.onclick = function (event) {
                event.stopPropagation();
                Deletar(item.id);
            };
            cell6.appendChild(trashIcon);
        }
    } else {
        alert('Erro ao carregar horários!');
        console.log(response.json());
    }
}

async function CadastrarHorario(event) {
    if (event) {
        event.preventDefault()
    }
    if (form.checkValidity()) {
        const chave = localStorage.getItem('chaveConectada')
        const usuario = localStorage.getItem('usuarioConectado')
        const id_setor = document.getElementById('selectSetor').value;
        const dia = document.getElementById('selectDia').value;
        const h_inicio = document.getElementById('hInicio').value;
        const h_termino = document.getElementById('hTermino').value;
        const demanda = document.getElementById('demanda').value;
        const body = { chave, usuario, id_setor, dia, h_inicio, h_termino, demanda };
        if (isEdit) {
            const response = await sendPut('/horarios/' + editId, body);
            if (response) {
                carregarTabela();
                FecharModal();
                form.reset()
            } else {
                console.error('Erro ao atualizar o horário.');
                alert('Erro ao atualizar horário!');
            }
        } else {
            const response = await sendPost('/horarios', body);
            if (response) {
                carregarTabela()
                FecharModal()
                form.reset()
            } else {
                console.error('Erro ao cadastrar o horário.');
                alert('Erro ao cadastrar horário!')
            }
        }
    } else {
        form.reportValidity();
    }

}

async function Deletar(id) {
    const confirmacao = confirm('Você tem certeza que deseja apagar esse horário?');
    if (confirmacao) {
        const usuario = localStorage.getItem('usuarioConectado');
        const data = { usuario };
        const response = await sendDelete('/horarios/' + id, data)
        if (response) {
            carregarTabela();
        } else {
            alert('Erro ao deletar horário no banco de dados!');
        }
    }
}
