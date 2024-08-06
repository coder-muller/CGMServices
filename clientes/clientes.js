import { parseDate, isValidDate } from '../utils.js';

const tableClientes = document.getElementById('tableClientes').getElementsByTagName('tbody')[0]
const tableClientesOver = document.getElementById('tableClientes')

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
formClientes.addEventListener('submit', CadastarCliente)

////////// Modal Edição Cliente //////////////////////////////////////////////////////////////////////////////////
const formClientesEdit = document.getElementById('formClientesEdit')
const modalClientesEdit = document.getElementById('modalClientesEdit')

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

function AbrirModalClientesEdit() {
    modalClientesEdit.style.display = 'block'
}
function FecharModalClientesEdit() {
    modalClientesEdit.style.display = 'none'
    formClientesEdit.reset()
}
//formClientesEdit.addEventListener('submit', )

/////////// Funções ////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async function () {
    await carregarClientes()
});

async function carregarClientes() {
    const chave = localStorage.getItem('chaveConectada')
    try {
        const response = await fetch('http://localhost:4567/clientes/' + chave)
        if ((await response).ok) {
            const data = await response.json()
            while (tableClientesOver.rows.length > 1) {
                tableClientesOver.deleteRow(1);
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                const row = tableClientes.insertRow()
                const cell1 = row.insertCell(0)
                const cell2 = row.insertCell(1)
                const cell3 = row.insertCell(2)
                const cell4 = row.insertCell(3)
                const cell5 = row.insertCell(4)
                const cell6 = row.insertCell(5)
                const cell7 = row.insertCell(6)
                cell1.innerHTML = item.nome
                cell2.innerHTML = item.cpf
                cell3.innerHTML = item.fone
                cell4.innerHTML = item.email
                cell5.innerHTML = new Date(item.dt_nascto).toLocaleDateString('pt-BR')
                cell6.innerHTML = item.cidade
                cell7.innerHTML = item.endereco
            }
        } else {
            alert('Erro ao carregar clientes!')
            console.log(response.json())
        }
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar usuários!')
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

            try {
                const response = await fetch('http://localhost:4567/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    modalClientes.style.display = 'none'
                    carregarClientes()
                    alert('Cliente criado com sucesso!')
                    formClientes.reset()
                } else {
                    alert('Erro ao criar cliente!')
                }
            } catch (error) {
                console.error(error)
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

            try {
                const response = await fetch('http://localhost:4567/clientes', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    modalClientesEdit.style.display = 'none'
                    carregarClientes()
                    alert('Cliente editado com sucesso!')
                    formClientesEdit.reset()
                } else {
                    alert('Erro ao editar cliente!')
                }
            } catch (error) {
                console.error(error)
            }

        } else {
            alert('Data Inválida')
        }
    } else {
        formClientesEdit.reportValidity()
    }
}



