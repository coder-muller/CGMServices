const modal = document.getElementById('modal')
const btNovoUsuario = document.getElementById('novoUsuario')
const btVoltarModal = document.getElementById('btVoltarModal')
const form = document.getElementById('formUser')
const table = document.getElementById('tableUsuarios').getElementsByTagName('tbody')[0]

const nomeInput = document.getElementById('nomeInput')
const permissaoInput = document.getElementById('permissaoInput')
const senhaInput = document.getElementById('senhaInput')
const cSenhaInput = document.getElementById('cSenhaInput')

document.addEventListener('DOMContentLoaded', async function () {
    await carregarUsuarios()
});

btNovoUsuario.onclick = function () {
    modal.style.display = 'block';
}

btVoltarModal.onclick = function () {
    modal.style.display = 'none';
    form.reset()
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

async function carregarUsuarios() {
    const chave = localStorage.getItem('chaveConectada')
    try {
        const response = await fetch('http://localhost:4567/usuarios/' + chave)
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
                cell1.innerHTML = item.id
                cell2.innerHTML = item.nome
                cell3.innerHTML = item.permissao
                cell4.innerHTML = '<img src="../../img/trash.png" alt="edição" onclick="deletarUsuario(' + item.id + ', ' + item.permissao +')">';
            }
        } else {
            alert('Erro ao carregar usuários!')
            console.log(response.json())
        }
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar usuários!')
    }
}

async function novoUsuario() {
    if (form.checkValidity()) {
        const nome = nomeInput.value
        const permissao = permissaoInput.value
        const senha = senhaInput.value
        const cSenha = cSenhaInput.value

        const chave = localStorage.getItem('chaveConectada')
        const permissaoConectada = localStorage.getItem('permissaoConectada')
        const usuario = localStorage.getItem('usuarioConectado')

        if (senha === cSenha) {
            if (parseInt(permissao) <= parseInt(permissaoConectada)) {
                const data = {
                    chave,
                    nome,
                    senha,
                    permissao,
                    usuario,
                }
                const response = await fetch('http://localhost:4567/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                if ((await response).ok) {
                    alert('Usuário criado com sucesso!')
                    modal.style.display = 'none';
                    await carregarUsuarios()
                } else {
                    alert('Erro ao criar usuário!')
                }
            } else {
                alert('Permissão maior que a do usuário conectado!')
            }
        } else {
            alert('Confirmação de senha inválida!')
            senhaInput.value = ''
            cSenhaInput.value = ''
        }
    } else {
        form.reportValidity()
    }
}

async function deletarUsuario(id, permissao) {
    const permissaoConectada = localStorage.getItem('permissaoConectada')
    const confirmacao = confirm('Tem certeza que deseja excluir esse usuário?')
    const usuario = localStorage.getItem('usuarioConectado')
    if (confirmacao) {
        if (parseInt(permissaoConectada) >= parseInt(permissao)) {
            try {
                const data = {
                    usuario,
                }
                const response = await fetch('http://localhost:4567/usuarios/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Usuário deletado com secesso!')
                    await carregarUsuarios()
                } else {
                    alert('Erro ao excluir usuário!')
                }
            } catch (error) {
                console.error(error)
                alert('Erro ao excluir usuário!')
            }
        } else {
            alert('Nível de permissão insuficiente para exclusão!')
        }
    }
}