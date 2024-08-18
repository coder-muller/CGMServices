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
    console.log(req.body)
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

app.get('/procedimentos/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const all = await prisma.procedimentos.findMany({
            where:{
                chave:chave,
            }
        })
        return res.status(200).json(all)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/procedimentos', async (req, res) => {
    const { chave, procedimento, usuario } = req.body
    try {
        const newPro = await prisma.procedimentos.create({
            data: {
                chave,
                procedimento,
            }
        });
        try {
            await createLog(chave, "Inclusão", "procedimentos", `Procedimentos com ID: ${newPro.id} criado, procedimento: ${newPro.procedimento}`, newPro.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newPro)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.put('/procedimentos/:id', async (req, res) => {
    const id = req.params.id
    const { chave, procedimento, usuario } = req.body
    try {
        const updatedPro = await prisma.procedimentos.update({
            where:{
                id:parseInt(id)
            },
            data: {
                chave,
                procedimento,
            }
        });
        try {
            await createLog(chave, "Edição", "procedimentos", `Procedimento com ID: ${updatedPro.id} editado, procedimento: ${updatedPro.procedimento}`, updatedPro.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(updatedPro)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/procedimentos/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedPro = await prisma.procedimentos.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedPro.chave, "Exclusão", "procedimentos", `Procedimento com ID: ${deletedPro.id} deletado, procedimento: ${deletedPro.procedimento}`, deletedPro.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedPro)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/avaliacoes/:chave/:id_cliente', async (req, res) => {
    const chave = req.params.chave
    const id_cliente = req.params.id_cliente
    try {
        const all = await prisma.avaliacoes.findMany({
            where:{
                chave:chave,
                id_cliente: parseInt(id_cliente)
            },
            orderBy:{
                dt_leitura: 'desc'
            }
        })
        return res.status(200).json(all)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/avaliacoes', async (req, res) => {
    const { chave, id_cliente, id_procedimento, resultado, observacao, dt_leitura, usuario } = req.body
    try {
        const newPro = await prisma.avaliacoes.create({
            data: {
                chave,
                id_cliente: parseInt(id_cliente),
                id_procedimento: parseInt(id_procedimento),
                resultado,
                observacao,
                dt_leitura: new Date(dt_leitura)
            }
        });
        try {
            await createLog(chave, "Inclusão", "avaliacoes", `Avaliação com ID: ${newPro.id} criada, Resultado: ${newPro.resultado}`, newPro.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newPro)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/avaliacoes/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedPro = await prisma.avaliacoes.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedPro.chave, "Exclusão", "avaliacoes", `Avaliação com ID: ${deletedPro.id} deletada, Resultado: ${deletedPro.resultado}`, deletedPro.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedPro)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/setores/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const all = await prisma.setores.findMany({
            where:{
                chave:chave,
            }
        })
        return res.status(200).json(all)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.get('/setores/:chave/:id', async (req, res) => {
    const chave = req.params.chave
    const id = req.params.id
    try {
        const all = await prisma.setores.findMany({
            where:{
                chave:chave,
                id: parseInt(id)
            }
        })
        return res.status(200).json(all)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/setores', async (req, res) => {
    const { chave, setor, usuario } = req.body
    try {
        const newSetor = await prisma.setores.create({
            data: {
                chave,
                setor,
            }
        });
        try {
            await createLog(chave, "Inclusão", "setores", `Setor com ID: ${newSetor.id} criado, setor: ${newSetor.setor}`, newSetor.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newSetor)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.put('/setores/:id', async (req, res) => {
    const id = req.params.id
    const { chave, setor, usuario } = req.body
    try {
        const updatedSetor = await prisma.setores.update({
            where:{
                id:parseInt(id)
            },
            data: {
                chave,
                setor,
            }
        });
        try {
            await createLog(chave, "Edição", "setores", `Setor com ID: ${updatedSetor.id} editado, setor: ${updatedSetor.setor}`, updatedSetor.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(updatedSetor)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/setores/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedSetor = await prisma.setores.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedPro.chave, "Exclusão", "setores", `Setor com ID: ${deletedSetor.id} deletado, setor: ${deletedSetor.setor}`, deletedSetor.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedSetor)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/profissionais/:chave', async (req, res) => {
    const chave = req.params.chave
    try {
        const all = await prisma.profissionais.findMany({
            where:{
                chave:chave,
            }
        })
        return res.status(200).json(all)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
})

app.post('/profissionais', async (req, res) => {
    const { chave, profissional, id_setor, usuario } = req.body
    try {
        const newProfissional = await prisma.profissionais.create({
            data: {
                chave,
                profissional,
                id_setor: parseInt(id_setor),
            }
        });
        try {
            await createLog(chave, "Inclusão", "profissionais", `Profissional com ID: ${newProfissional.id} criado, nome: ${newProfissional.profissional}`, newProfissional.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(newProfissional)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.put('/profissionais/:id', async (req, res) => {
    const id = req.params.id
    const { chave, profissional, id_setor, usuario } = req.body
    try {
        const updatedProfissional = await prisma.profissionais.update({
            where:{
                id:parseInt(id)
            },
            data: {
                chave,
                profissional,
                id_setor: parseInt(id_setor),
            }
        });
        try {
            await createLog(chave, "Edição", "profissionais", `Profissional com ID: ${updatedProfissional.id} editado, nome: ${updatedProfissional.profissional}`, updatedProfissional.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(updatedProfissional)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }  
})

app.delete('/profissionais/:id', async (req, res) => {
    const id = req.params.id
    const usuario = req.body.usuario
    try {
        const deletedProfissional = await prisma.profissionais.delete({
            where:{
                id:parseInt(id)
            },
        });
        try {
            await createLog(deletedProfissional.chave, "Exclusão", "profissionais", `Profissional com ID: ${deletedProfissional.id} deletado, nome: ${deletedProfissional.profissional}`, deletedProfissional.id, usuario)
        } catch (error) {
            console.error(error)
        }
        return res.status(200).json(deletedProfissional)
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





