const modal = document.getElementById('modal');
const form = document.getElementById('formProfissionais');
const btNovo = document.getElementById('novoProfissional');

const btcadastrar = document.getElementById('cadastarProfissional');
const btvoltar = document.getElementById('btVoltarModal');

const table = document.getElementById('tableProfissionais');
const tableTbody = document.getElementById('tableProfissionais').getElementsByTagName('tbody')[0];

let isEdit = false;
let editId = null;

async function AbrirModal(mode, profisional = '', setor = '') {
    modal.style.display = 'block';
    isEdit = (mode === 1);
    profissionalInput.value = profisional;
    profissionalInput.focus();
    await carregarSelect();
    if (isEdit) {
        setoresSelect.value = setor;
    }
}

function FecharModal() {
    modal.style.display = 'none';
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
    try {
        const response = await fetch('http://localhost:4567/profissionais/' + chave);
        if (response.ok) {
            const data = await response.json();
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
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
                try {
                    const response = await fetch('http://localhost:4567/setores/' + chave + '/' + item.id_setor)
                    if(response.ok){
                        const data = await response.json()
                        cell3.innerHTML = data[0].setor
                    }else{
                        console.log('erro aqui')
                    }
                } catch (error) {
                    console.error(error)
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
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar profissionais!');
    }
}

async function carregarSelect() {
    const chave = localStorage.getItem('chaveConectada');
    try {
        const response = await fetch('http://localhost:4567/setores/' + chave);
        if (response.ok) {
            const setores = await response.json();
            setoresSelect.innerHTML = ''; // Limpa o select antes de adicionar novos itens
            setores.forEach(setor => {
                const option = document.createElement('option');
                option.value = setor.id;
                option.textContent = setor.setor;
                setoresSelect.appendChild(option);
            });
        } else {
            alert('Erro ao carregar setores!');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar setores!');
    }
}


async function Cadastrar(event) {
    event.preventDefault();
    if (form.checkValidity()) {
        try {
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
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? 'http://localhost:4567/profissionais/' + editId : 'http://localhost:4567/profissionais';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                carregarProfissionais();
                modal.style.display = 'none';
            } else {
                alert('Erro ao cadastrar/editar profissional no banco de dados!');
                modal.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        form.reportValidity();
    }
}

async function Deletar(id) {
    const confirmacao = confirm('Você tem certeza que deseja apagar esse profissional?');
    if (confirmacao) {
        try {
            const usuario = localStorage.getItem('usuarioConectado');
            const data = { usuario };
            const response = await fetch('http://localhost:4567/profissionais/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                carregarProfissionais();
            } else {
                alert('Erro ao deletar profissional no banco de dados!');
            }
        } catch (error) {
            console.error(error);
        }
    }
}
