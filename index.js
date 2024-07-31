const chaveInput = document.getElementById('chaveInput')
const usuarioInput = document.getElementById('usuarioInput')
const senhaInput = document.getElementById('senhaInput')
const loginForm = document.getElementById('loginForm')

async function logIn() {

    if (loginForm.checkValidity()) {
        const chave = chaveInput.value
        const usuario = usuarioInput.value
        const senha = senhaInput.value
        try {
            const response = await fetch('http://localhost:4567/usuarios/' + chave)
            const users = await response.json()
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
                usuarioInput.value = ''
                senhaInput.value = ''
                alert('Senha inválida para a chave fornecida')
                return 
            }
            loginForm.reset()
            window.location.href='principal/principal.html'
        } catch (error) {
            console.error("Erro ao realizar login! erro:" + error)
            alert('Ocorreu um erro ao tentar realizar o login. Por favor, tente novamente mais tarde.')
        }

    } else {
        loginForm.reportValidity()
    }
}