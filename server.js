const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client')

const PORT = 4567;

const prisma = new PrismaClient()
const app = express();
app.use(bodyParser.json())
app.use(cors())

app.get('/usuarios/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const allUsers = await prisma.usuarios.findMany({
            where:{
                chave:chave,
            }
        })
        return res.status(200).json(allUsers)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.get('/usuarios/:chave/:id', async (req, res) => {
    const id = req.params.id
    const chave = req.params.chave
    try {
        const user = await prisma.usuarios.findUnique({
            where:{
                id:parseInt(id),
                chave:chave,
            }
        })
        return res.status(200).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/usuarios', async (req, res) => {
    const { chave, nome, senha, permissao, usuario } = req.body
    try {
        const newUser = await prisma.usuarios.create({
            data: {
                chave,
                nome,
                senha,
                permissao: parseInt(permissao)
            }
        });
        try {
            await createLog(chave, "Inclusão", "usuarios", `Usuário com ID: ${newUser.id} criado, nome: ${newUser.nome}, permissão: ${newUser.permissao}`, newUser.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.put('/usuarios/:id', async (req, res) => {
    const id = req.params.id
    const { chave, nome, senha, permissao, usuario } = req.body
    try {
        const updatedUser = await prisma.usuarios.update({
            where:{
                id:parseInt(id)
            },
            data: {
                chave,
                nome,
                senha,
                permissao: parseInt(permissao)
            }
        });
        try {
            await createLog(chave, "Edição", "usuarios", `Usuário com ID: ${updatedUser.id} editado, nome: ${updatedUser.nome}, permissão: ${updatedUser.permissao}`, updatedUser.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/usuarios/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedUser = await prisma.usuarios.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedUser.chave, "Exclusão", "usuarios", `Usuário com ID: ${deletedUser.id} deletado, nome: ${deletedUser.nome}, permissão: ${deletedUser.permissao}`, deletedUser.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/clientes/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const allClientes = await prisma.clientes.findMany({
            where:{
                chave:chave,
            },
            orderBy:{
                nome: 'asc'
            }
        })
        return res.status(200).json(allClientes)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.get('/clientes/:chave/:id', async (req, res) => {
    const id = req.params.id
    const chave = req.params.chave
    try {
        const cliente = await prisma.clientes.findUnique({
            where:{
                id:parseInt(id),
                chave:chave,
            }
        })
        return res.status(200).json(cliente)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/clientes', async (req, res) => {
    const { chave, nome, cpf, endereco, numero, bairro, cidade, estado, cep, dt_nascto, profissao, email, fone, usuario } = req.body
    console.log(req.body)
    try {
        const newCliente = await prisma.clientes.create({
            data: {
                chave,
                nome,
                cpf,
                endereco,
                numero: parseInt(numero),
                bairro,
                cidade,
                estado,
                cep,
                dt_nascto: new Date(dt_nascto),
                profissao,
                email,
                fone,
            }
        });
        try {
            await createLog(chave, "Inclusão", "clientes", `Cliente com ID: ${newCliente.id} criado, nome: ${newCliente.nome}, CPF: ${newCliente.cpf}`, newCliente.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newCliente)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.put('/clientes/:id', async (req, res) => {
    const id = req.params.id
    const { chave, nome, cpf, endereco, numero, bairro, cidade, estado, cep, dt_nascto, profissao, email, fone, usuario } = req.body
    try {
        const updatedCliente = await prisma.clientes.update({
            where:{
                id:parseInt(id)
            },
            data: {
                chave,
                nome,
                cpf,
                endereco,
                numero: parseInt(numero),
                bairro,
                cidade,
                estado,
                cep,
                dt_nascto: new Date(dt_nascto),
                profissao,
                email,
                fone,
            }
        });
        try {
            await createLog(chave, "Edição", "clientes", `Cliente com ID: ${updatedCliente.id} editado, nome: ${updatedCliente.nome}, CPF: ${updatedCliente.cpf}`, updatedCliente.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(updatedCliente)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedCliente = await prisma.clientes.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedCliente.chave, "Exclusão", "clientes", `Cliente com ID: ${deletedCliente.id} deletado, nome: ${deletedCliente.nome}`, deletedCliente.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedCliente)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function createLog(chave, procedimento, tabela, log, id_registro, usuario){
    try {
        const newLog = await prisma.logs.create({
            data:{
                chave,
                procedimento,
                tabela,
                log, 
                id_registro,
                usuario,
                timestamp: new Date()
            }
        })
        return 
    } catch (error) {
        console.error(error)
        return
    }
}

app.get('/logs/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const logs = await prisma.logs.findMany({
            where:{
                chave,
            },
            orderBy:{
                timestamp: 'desc'
            }
        })

        return res.status(200).json(logs)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 





