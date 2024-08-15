import { parseDate, isValidDate, convertIsoToDate, sendGet, sendPost, sendPut, sendDelete } from '../utils.js';

const tableClientes = document.getElementById('tableClientes').getElementsByTagName('tbody')[0]
const tableClientesOver = document.getElementById('tableClientes')
const searchInput = document.getElementById('searchInput')

searchInput.addEventListener('input', function () {
    carregarClientes(this.value);
});

////////// Modal Inclusão Cliente //////////////////////////////////////////////////////////////////////////////////
const formClientes = document.getElementById('formClientes')
const modalClientes = document.getElementById('modalClientes')

const btNovoCliente = document.getElementById('btNovoCliente')
const btVoltarModal = document.getElementById('btVoltar')

const nomeInput = document.getElementById('nomeInput')
const cpfInput = document.getElementById('cpfInput')
const enderecoInput = document.getElementById('enderecoInput')
const numeroInput = document.getElementById('numeroInput')
const bairroInput = document.getElementById('bairroInput')
const cidadeInput = document.getElementById('cidadeInput')
const estadoInput = document.getElementById('estadoInput')
const cepInput = document.getElementById('cepInput')
const dtNascInput = document.getElementById('dtNascInput')
const profissaoInput = document.getElementById('profissaoInput')
const emailInput = document.getElementById('emailInput')
const foneInput = document.getElementById('foneInput')

function AbrirModalClientes() {
    modalClientes.style.display = 'block'
}
function FecharModalClientes() {
    modalClientes.style.display = 'none'
    formClientes.reset()
}

btNovoCliente.addEventListener('click', AbrirModalClientes)
btVoltarModal.addEventListener('click', FecharModalClientes)
formClientes.addEventListener('submit', CadastarCliente)

////////// Modal Edição Cliente //////////////////////////////////////////////////////////////////////////////////
const formClientesEdit = document.getElementById('formClientesEdit')
const modalClientesEdit = document.getElementById('modalClientesEdit')

const btEditarCliente = document.getElementById('btEditarCliente')
const btVoltarModalEdit = document.getElementById('btVoltarEdit')
const btProcedimentos = document.getElementById('mostrarProcedimentos')
const btExcluirCliente = document.getElementById('excluirCliente')

const nomeInputEdit = document.getElementById('nomeInputEdit')
const cpfInputEdit = document.getElementById('cpfInputEdit')
const enderecoInputEdit = document.getElementById('enderecoInputEdit')
const numeroInputEdit = document.getElementById('numeroInputEdit')
const bairroInputEdit = document.getElementById('bairroInputEdit')
const cidadeInputEdit = document.getElementById('cidadeInputEdit')
const estadoInputEdit = document.getElementById('estadoInputEdit')
const cepInputEdit = document.getElementById('cepInputEdit')
const dtNascInputEdit = document.getElementById('dtNascInputEdit')
const profissaoInputEdit = document.getElementById('profissaoInputEdit')
const emailInputEdit = document.getElementById('emailInputEdit')
const foneInputEdit = document.getElementById('foneInputEdit')
let idModalEdicao

function AbrirModalClientesEdit(cliente, id) {
    modalClientesEdit.style.display = 'block'
    idModalEdicao = id

    nomeInputEdit.value = cliente.nome
    cpfInputEdit.value = cliente.cpf
    enderecoInputEdit.value = cliente.endereco
    numeroInputEdit.value = cliente.numero
    bairroInputEdit.value = cliente.bairro
    cidadeInputEdit.value = cliente.cidade
    estadoInputEdit.value = cliente.estado
    cepInputEdit.value = cliente.cep
    dtNascInputEdit.value = convertIsoToDate(cliente.dt_nascto)
    profissaoInputEdit.value = cliente.profissao
    emailInputEdit.value = cliente.email
    foneInputEdit.value = cliente.fone
}
function FecharModalClientesEdit() {
    modalClientesEdit.style.display = 'none'
    formClientesEdit.reset()
}

btExcluirCliente.addEventListener('click', () => {
    ExcluirCliente(idModalEdicao, event)
})
btVoltarModalEdit.addEventListener('click', FecharModalClientesEdit)
btEditarCliente.addEventListener('click', EditarCliente)

/////////// Funções ////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async function () {
    await carregarClientes()
});

async function carregarClientes(filtroNome = '') {
    const chave = localStorage.getItem('chaveConectada');
    const data = await sendGet('/clientes/' + chave)
    const filteredData = filtroNome
        ? data.filter(cliente =>
            cliente.nome.toLowerCase().includes(filtroNome.toLowerCase())
        )
        : data;
    while (tableClientesOver.rows.length > 1) {
        tableClientesOver.deleteRow(1);
    }
    for (let i = 0; i < filteredData.length; i++) {
        const item = filteredData[i];
        const row = tableClientes.insertRow();
        row.onclick = function () {
            AbrirModalClientesEdit(item, item.id);
        };
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        cell1.innerHTML = item.nome;
        cell2.innerHTML = item.cpf;
        cell3.innerHTML = item.fone;
        cell4.innerHTML = item.email;
        cell5.innerHTML = new Date(item.dt_nascto).toLocaleDateString('pt-BR');
        cell6.innerHTML = item.cidade;
        cell7.innerHTML = item.endereco;
    }
}

async function CadastarCliente(event) {
    event.preventDefault();
    if (formClientes.checkValidity()) {
        if (isValidDate(dtNascInput.value)) {

            const chave = localStorage.getItem('chaveConectada')
            const usuario = localStorage.getItem('usuarioConectado')

            const nome = nomeInput.value
            const cpf = cpfInput.value
            const endereco = enderecoInput.value
            const numero = numeroInput.value
            const bairro = bairroInput.value
            const cidade = cidadeInput.value
            const estado = estadoInput.value
            const cep = cepInput.value
            const dt_nascto = parseDate(dtNascInput.value)
            const profissao = profissaoInput.value
            const email = emailInput.value
            const fone = foneInput.value

            const data = {
                chave,
                nome,
                cpf,
                endereco,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                dt_nascto,
                profissao,
                email,
                fone,
                usuario,
            }
            const response = await sendPost('/clientes', data)
            if (response) {
                modalClientes.style.display = 'none'
                carregarClientes()
                formClientes.reset()
            } else {
                alert('Erro ao criar cliente!')
            }
        } else {
            alert('Data Inválida')
        }
    } else {
        formClientes.reportValidity()
    }
}

async function EditarCliente(event) {
    event.preventDefault();
    if (formClientesEdit.checkValidity()) {
        if (isValidDate(dtNascInputEdit.value)) {

            const chave = localStorage.getItem('chaveConectada')
            const usuario = localStorage.getItem('usuarioConectado')

            const nome = nomeInputEdit.value
            const cpf = cpfInputEdit.value
            const endereco = enderecoInputEdit.value
            const numero = numeroInputEdit.value
            const bairro = bairroInputEdit.value
            const cidade = cidadeInputEdit.value
            const estado = estadoInputEdit.value
            const cep = cepInputEdit.value
            const dt_nascto = parseDate(dtNascInputEdit.value)
            const profissao = profissaoInputEdit.value
            const email = emailInputEdit.value
            const fone = foneInputEdit.value

            const data = {
                chave,
                nome,
                cpf,
                endereco,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                dt_nascto,
                profissao,
                email,
                fone,
                usuario,
            }
            const response = await sendPut('/clientes/' + idModalEdicao, data)
            if (response) {
                modalClientesEdit.style.display = 'none'
                carregarClientes()
                formClientesEdit.reset()
            } else {
                alert('Erro ao editar cliente!')
            }
        } else {
            alert('Data Inválida')
        }
    } else {
        formClientesEdit.reportValidity()
    }
}

async function ExcluirCliente(id, event) {
    event.preventDefault()

    const confirmacao = confirm('Você tem certeza que deseja excluir o cliente? Essa ação é IRREVERSÍVEL!')
    if (confirmacao) {
        const usuario = localStorage.getItem('usuarioConectado')
        const data = {
            usuario,
        }
        await sendDelete('/clientes/' + id, data)
        FecharModalClientesEdit()
        carregarClientes()
    }
}