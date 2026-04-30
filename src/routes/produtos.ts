// ===== IMPORTAÇÕES =====
// Importa a instância do Prisma para operações de banco de dados
import { prisma } from "../../lib/prisma"
// Importa o tipo enum 'Tipo' dos modelos Prisma gerados
import { Tipo } from "../generated/prisma/enums"

// Importa o Router do Express para gerenciar rotas HTTP
import { Router } from 'express'
// Importa o Zod para validação de esquemas de dados
import { z } from 'zod'

// ===== INICIALIZAÇÃO DA ROTA =====
// Cria uma instância do router do Express para gerenciar as rotas de produtos
const router = Router()

// ===== VALIDAÇÃO COM ZOD =====
// Define o esquema de validação para produtos
// Este schema garante que os dados enviados atendem aos requisitos
const produtoSchema = z.object({
    // Descrição do produto - string com mínimo de 3 caracteres
    descricao: z.string().min(3,
        { message: "A descricao deve possuir pelo menos 3 caracteres"},
    ),
    // Preço do produto - número
    preco: z.number(),
    // URL ou path da foto do produto - string
    foto: z.string(),
    // Ingredientes do produto - opcional e pode ser null
    ingredientes: z.string().nullable().optional(),
    // Tipo de produto (ex: prato principal, sobremesa) - opcional
    Tipo: z.enum(Tipo).optional(),
    // Tempo de preparo em minutos - opcional e pode ser null
    tempoPreparo: z.number().nullable().optional(),
    // Status ativo/inativo do produto - booleano
    status: z.boolean(),
    // ID do restaurante ao qual o produto pertence
    restauranteId: z.number(),
})


// ===== ROTA GET / =====
// Busca todos os produtos do banco de dados
// Método: GET | Endpoint: /
// Retorna: Array de todos os produtos com dados do restaurante associado
router.get("/", async (req, res) => {
    try {
        // Busca todos os produtos e inclui dados do restaurante relacionado
        const produto = await prisma.produto.findMany({
            include: {
                restaurante: true, // Inclui informações completas do restaurante
            }
        })
        // Retorna os produtos com código 200 (OK)
        res.status(200).json(produto)
    } catch (error) {
        // Em caso de erro, retorna código 500 (Erro Interno do Servidor)
        res.status(500).json({ erro: error})
    }
})

// ===== ROTA GET /:id =====
// Busca um produto específico pelo seu ID
// Método: GET | Endpoint: /:id
// Parâmetro: id (número)
// Retorna: Objeto do produto encontrado ou erro se não existir
router.get("/:id", async (req, res) => {
    // Extrai o ID dos parâmetros da URL
    const { id } = req.params

    try {
        // Busca o primeiro produto que corresponde ao ID fornecido
        const produto = await prisma.produto.findFirst({
            where: {id: Number(id)}, // Converte ID de string para número
            include: {
                restaurante: true // Inclui dados do restaurante
            }
        })
        // Retorna o produto encontrado
        res.status(200).json(produto)
    } catch(error) {
        // Em caso de erro, retorna código 500
        res.status(500).json({erro: error})
    }
})

// ===== ROTA POST / =====
// Cria um novo produto no banco de dados
// Método: POST | Endpoint: /
// Body: Objeto produto com todos os campos obrigatórios
// Retorna: Produto criado com seu ID gerado
router.post("/", async (req, res) => {
    // Valida os dados recebidos usando o schema definido
    const valida = produtoSchema.safeParse(req.body)
    // Se a validação falhar, retorna erro 400 com detalhes
    if (!valida.success) {
        res.status(400).json({ erro: valida.error})
        return 
    }

    // Extrai os dados validados
    const {descricao, preco, foto, ingredientes, Tipo, tempoPreparo, status, restauranteId} = valida.data

    try {
        // Cria um novo produto no banco de dados
        const produto = await prisma.produto.create({
            data: {
                descricao, preco, foto, ingredientes, Tipo, tempoPreparo, status, restauranteId
            }
        })
        // Retorna o produto criado com código 201 (Criado)
        res.status(201).json(produto)
    } catch (error) {
        // Em caso de erro, retorna código 500
        res.status(500).json({error})
    }
})

// ===== ROTA DELETE /:id =====
// Deleta um produto específico pelo seu ID
// Método: DELETE | Endpoint: /:id
// Parâmetro: id (número)
// Retorna: Produto deletado ou erro se não existir
router.delete("/:id", async (req, res) => {
    // Extrai o ID dos parâmetros da URL
    const {id} = req.params

    try {
        // Deleta o produto com o ID especificado
        const produto = await prisma.produto.delete({
            where: {id: Number(id)} // Converte ID de string para número
        })
        // Retorna o produto que foi deletado
        res.status(200).json(produto)
    } catch (error) {
        // Em caso de erro (ex: produto não encontrado), retorna código 500
        res.status(500).json({ erro: error})
    }
})

// ===== ROTA PUT /:id =====
// Atualiza um produto existente pelo seu ID
// Método: PUT | Endpoint: /:id
// Parâmetro: id (número)
// Body: Objeto com campos atualizados
// Retorna: Produto atualizado ou erro
router.put("/:id", async (req,res) => {
    // Extrai o ID dos parâmetros da URL
    const { id } = req.params

    // Valida os dados recebidos usando o schema definido
    const valida = produtoSchema.safeParse(req.body)
    // Se a validação falhar, retorna erro 400
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    // Extrai os dados validados
    const { descricao, preco, foto, ingredientes, Tipo, status, restauranteId} = valida.data

    try {
        // Atualiza o produto identificado pelo ID
        const produto = await prisma.produto.update({
            where: { id: Number(id)}, // Converte ID de string para número
            data: {
                // Atualiza todos os campos com os novos valores
                descricao, preco, foto, ingredientes, Tipo, status, restauranteId
            }
        })
        // Retorna o produto atualizado
        res.status(200).json(produto)
    } catch (error) {
        // Em caso de erro, retorna código 500
        res.status(500).json({ error })
    }
})

// ===== ROTA GET /pesquisa/:termo =====
// Busca produtos por termo de pesquisa (descrição, restaurante ou preço)
// Método: GET | Endpoint: /pesquisa/:termo
// Parâmetro: termo (string para busca ou número para preço máximo)
// Retorna: Array de produtos que correspondem aos critérios
router.get("/pesquisa/:termo", async (req, res) => {
    // Extrai o termo de pesquisa dos parâmetros
    const { termo } = req.params

    // Tenta converter o termo para número
    const termoNumero = Number(termo)

    // Se o termo NÃO for um número (é uma string de busca)
    if (Number.isNaN(termoNumero)) {
        try {
            // Busca produtos por descrição OU por nome do restaurante
            const produtos = await prisma.produto.findMany({
                include: {
                    restaurante: true, // Inclui dados do restaurante
                },
                where: {
                    // OR: Retorna resultados que correspondem A QUALQUER uma das condições
                    OR: [
                        // Busca na descrição do produto (insensível a maiúsculas/minúsculas)
                        { descricao: {contains: termo, mode: "insensitive"} },
                        // Busca no nome do restaurante (insensível a maiúsculas/minúsculas)
                        { restaurante: { nome: {equals: termo, mode: "insensitive"} } }
                    ]
                }
            })
            // Retorna os produtos encontrados
            res.status(200).json(produtos)
        } catch (error) {
            // Em caso de erro, retorna código 500
            res.status(500).json({ erro: error })
        }
    } else {
        // Se o termo É um número, busca produtos com preço menor ou igual
        try {
            // Busca produtos com preço até o valor do termo
            const produtos = await prisma.produto.findMany({
                include: {
                    restaurante: true, // Inclui dados do restaurante
                },
                where: {
                    // lte = "less than or equal" (menor ou igual a)
                    preco: {lte: termoNumero}
                }
            })
            // Retorna os produtos encontrados
            res.status(200).json(produtos)
        } catch (error) {
            // Em caso de erro, retorna código 500
            res.status(500).json({ erro: error})
        }
    }
})

// ===== EXPORTAÇÃO DA ROTA =====
// Exporta o router para que possa ser importado e usado na aplicação principal
export default router
