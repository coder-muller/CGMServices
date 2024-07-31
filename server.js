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
            await createLog(chave, "Inclusão", "usuarios", `Usuário com ID:${newUser.id} criado, nome:${newUser.nome}, permissão: ${newUser.permissao}`, newUser.id, usuario)
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
            await createLog(chave, "Edição", "usuarios", `Usuário com ID:${updatedUser.id} editado, nome:${updatedUser.nome}, permissão: ${updatedUser.permissao}`, updatedUser.id, usuario)
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
    try {
        const deletedUser = await prisma.usuarios.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(chave, "Exclusão", "usuarios", `Usuário com ID:${deletedUser.id} deletado, nome:${deletedUser.nome}, permissão: ${deletedUser.permissao}`, deletedUser.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

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
        return json(newLog)
    } catch (error) {
        console.error(error)
        return json({ error: error.message })
    }
}

app.get('/logs')

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 





