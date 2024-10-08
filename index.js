import { sendGet } from "./utils"

const chaveInput = document.getElementById('chaveInput')
const usuarioInput = document.getElementById('usuarioInput')
const senhaInput = document.getElementById('senhaInput')
const loginForm = document.getElementById('loginForm')

async function logIn() {
    if (loginForm.checkValidity()) {
        const chave = chaveInput.value
        const usuario = usuarioInput.value
        const senha = senhaInput.value
            const users = await sendGet('/usuarios/' + chave)
            if (users.length === 0) {
                alert('Chave não encontrada')
                loginForm.reset()
                return
            }
            const user = users.find(user => user.nome === usuario);
            if (!user) {
                usuarioInput.value = ''
                senhaInput.value = ''
                alert('Nome inválido para a chave fornecida')
                return
            }
            if (user.senha !== senha) {
                senhaInput.value = ''
                alert('Senha inválida para a chave fornecida')
                return 
            }
            loginForm.reset()

            localStorage.setItem('chaveConectada', user.chave)
            localStorage.setItem('idConectado', user.id)
            localStorage.setItem('usuarioConectado', user.nome)
            localStorage.setItem('permissaoConectada', user.permissao)

            window.location.href='principal/principal.html'
    } else {
        loginForm.reportValidity()
    }
}