// ===== IMPORTAÇÕES =====
// Importa a instância do Prisma para operações de banco de dados
import { prisma } from "../../lib/prisma"
// Importa o Router do Express para gerenciar rotas HTTP
import { Router } from "express"
// Importa o Zod para validação de esquemas de dados
import { z } from "zod"

// ===== INICIALIZAÇÃO DA ROTA =====
// Cria uma instância do router do Express para gerenciar as rotas de pedidos
const router = Router()

// ===== VALIDAÇÃO COM ZOD =====
// Define o esquema de validação para dados do pedido
// Garante que o produto ID é um número inteiro positivo
const pedidoSchema = z.object({
    // ID do produto - deve ser número inteiro e positivo
    produtoId: z.number().int().positive()
})


// ===== ROTA POST / =====
// Cria um novo pedido para o cliente autenticado
// Método: POST | Endpoint: /
// Body: Objeto com produtoId
// Requer: Cliente autenticado (token JWT válido)
// Retorna: Pedido criado com dados completos do produto e cliente
router.post("/", async (req, res) => {
    // Extrai o ID do produto do corpo da requisição
    const { produtoId } = req.body
    // Obtém o ID do cliente autenticado (definido por middleware de autenticação)
    const clienteId = (req as any).clienteId

    // Log para debug - mostra IDs do cliente e produto
    console.log('clienteId:', clienteId, 'produtoId:', produtoId)

    // Verifica se o cliente está autenticado
    if (!clienteId) {
        // Retorna código 401 (Não Autorizado) se cliente não está logado
        return res.status(401).json({ erro: 'Cliente não autenticado' })
    }

    try {
        // Valida o ID do produto usando o schema definido
        pedidoSchema.parse({ produtoId })

        // Cria um novo pedido no banco de dados
        const pedido = await prisma.pedido.create({
            data: {
                clienteId,   // ID do cliente que está fazendo o pedido
                produtoId    // ID do produto pedido
            },
            // Inclui dados relacionados ao pedido
            include: {
                produto: {
                    // Inclui dados do produto e do restaurante
                    include: { restaurante: true }
                },
                cliente: true // Inclui dados do cliente
            }
        })

        // Retorna o pedido criado com código 201 (Criado)
        res.status(201).json(pedido)
    } catch (error) {
        // Log do erro para debug
        console.error('Erro ao criar pedido:', error)
        
        // Se o erro for de validação do Zod
        if (error instanceof z.ZodError) {
            // Extrai as mensagens de erro do Zod e as formata
            const messages = error.issues.map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
            // Retorna código 400 (Requisição Inválida)
            res.status(400).json({ erro: messages })
        } else if (error instanceof Error) {
            // Se for um erro JavaScript padrão, retorna sua mensagem
            res.status(400).json({ erro: error.message })
        } else {
            // Caso contrário, converte o erro para string
            res.status(400).json({ erro: String(error) })
        }
    }
})

// ===== ROTA GET / =====
// Busca todos os pedidos do cliente autenticado
// Método: GET | Endpoint: /
// Requer: Cliente autenticado (token JWT válido)
// Retorna: Array de pedidos do cliente ordenados por data (mais recentes primeiro)
router.get("/", async (req, res) => {
    // Obtém o ID do cliente autenticado (definido por middleware de autenticação)
    const clienteId = (req as any).clienteId

    // Verifica se o cliente está autenticado
    if (!clienteId) {
        // Retorna código 401 (Não Autorizado) se cliente não está logado
        return res.status(401).json({ erro: 'Cliente não autenticado' })
    }

    try {
        // Busca todos os pedidos do cliente autenticado
        const pedidos = await prisma.pedido.findMany({
            where: { clienteId }, // Filtra por ID do cliente
            include: {
                produto: {
                    // Inclui dados do produto e do restaurante
                    include: { restaurante: true }
                }
            },
            orderBy: { createdAt: 'desc' } // Ordena por data de criação (mais recente primeiro)
        })

        // Retorna os pedidos do cliente
        res.status(200).json(pedidos)
    } catch (error) {
        // Log do erro para debug
        console.error('Erro ao buscar pedidos:', error)
        // Retorna código 500 (Erro Interno do Servidor)
        res.status(500).json({ erro: error instanceof Error ? error.message : error })
    }
})

router.delete("/:id", async (req,res) => {
    const clienteId = (req as any).clienteId
    const pedidoId = Number(req.params.id)

    console.log('DELETE pedido - clienteId:', clienteId, '| pedidoId:', pedidoId)

    const pedidoBruto = await prisma.pedido.findUnique({ where: {id: pedidoId}})
    console.log('Pedido no Banco: ', pedidoBruto)

    if (!clienteId) {
        return res.status(401).json({erro: 'Cliente nao autenticado'})
    }

    if (isNaN(pedidoId)) {
        return res.status(400).json({erro: 'ID do pedido invalido'})
    }

    try {
        const pedido = await prisma.pedido.findUnique({
            where: { id: pedidoId, clienteId }
    
        })

        if (!pedido) {
            return res.status(404).json({erro: 'Pedido nao encontrado'})
        }

        if (pedido.clienteId !== clienteId) {
            return res.status(403).json({erro: 'Acesso negado'})
        }

        await prisma.pedido.delete({
            where: { id: pedidoId }
        })

        res.status(200).json({message: 'Pedido excluido com sucesso'})
    } catch (error) {
        console.error('Erro ao excluir pedido:', error)
        res.status(500).json({erro: 'Erro interno do servidor'})
    }
})

// ===== EXPORTAÇÃO DA ROTA =====
// Exporta o router para que possa ser importado e usado na aplicação principal
export default router