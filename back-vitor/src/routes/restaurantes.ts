// ===== IMPORTAÇÕES =====
// Importa a instância do Prisma para operações de banco de dados
import {prisma} from "../../lib/prisma.js"

// Importa o Router do Express para gerenciar rotas HTTP
import { Router } from 'express'
// Importa o Zod para validação de esquemas de dados
import { z } from 'zod'

// ===== INICIALIZAÇÃO DA ROTA =====
// Cria uma instância do router do Express para gerenciar as rotas de restaurantes
const router = Router()

// ===== VALIDAÇÃO COM ZOD =====
// Define o esquema de validação para dados do restaurante
// Garante que os dados enviados atendem aos requisitos
const restauranteSchema = z.object({
    // Nome do restaurante - string com mínimo de 3 caracteres
    nome: z.string().min(3, 
        {message: "Modelo deve possuir pelo menos 3 caracteres"}
    )
})


// ===== ROTA GET / =====
// Busca todos os restaurantes cadastrados no banco de dados
// Método: GET | Endpoint: /
// Retorna: Array de todos os restaurantes
router.get("/", async (req, res) => {
    try {
        // Busca todos os registros da tabela restaurante
        const restaurantes = await prisma.restaurante.findMany()
        // Retorna os restaurantes com código 200 (OK)
        res.status(200).json(restaurantes)
    } catch (error) {
        // Em caso de erro, retorna código 500 (Erro Interno do Servidor)
        res.status(500).json({ erro: error }) 
    }
})

// ===== ROTA POST / =====
// Cria um novo restaurante no banco de dados
// Método: POST | Endpoint: /
// Body: Objeto restaurante com o campo nome
// Retorna: Restaurante criado com seu ID gerado
router.post("/", async (req, res) => {
    // Valida os dados recebidos usando o schema definido
    const valida = restauranteSchema.safeParse(req.body)
    // Se a validação falhar, retorna erro 400
    if (!valida.success){
        res.status(400).json({ erro: valida.error })
        return
    }

    // Extrai o nome validado
    const {nome} = valida.data

    try{
        // Cria um novo restaurante no banco de dados
        const restaurante = await prisma.restaurante.create({
            data: {nome} // Dados a serem inseridos
        })
        // Retorna o restaurante criado com código 201 (Criado)
        res.status(201).json(restaurante)
    } catch (error) {
        // Em caso de erro, retorna código 400 (Requisição Inválida)
        res.status(400).json({ error })
    }
})

// ===== ROTA DELETE /:id =====
// Deleta um restaurante específico pelo seu ID
// Método: DELETE | Endpoint: /:id
// Parâmetro: id (número)
// Retorna: Restaurante deletado ou erro se não existir
router.delete("/:id", async (req, res) => {
    // Extrai o ID dos parâmetros da URL
    const { id } = req.params

    try {
        // Deleta o restaurante com o ID especificado
        const restaurante = await prisma.restaurante.delete({
            where: {id: Number(id)} // Converte ID de string para número
        })
        // Retorna o restaurante que foi deletado com código 200 (OK)
        res.status(200).json(restaurante)
    } catch (error) {
        // Em caso de erro (ex: restaurante não encontrado), retorna código 400
        res.status(400).json({ error})
    }
})

// ===== ROTA PUT /:id =====
// Atualiza um restaurante existente pelo seu ID
// Método: PUT | Endpoint: /:id
// Parâmetro: id (número)
// Body: Objeto com campos atualizados
// Retorna: Restaurante atualizado ou erro
router.put("/:id", async (req, res) => {
    // Extrai o ID dos parâmetros da URL
    const {id} = req.params

    // Valida os dados recebidos usando o schema definido
    const valida = restauranteSchema.safeParse(req.body)
    // Se a validação falhar, retorna erro 400
    if (!valida.success){
        res.status(400).json({ erro: valida.error})
        return 
    }

    // Extrai o nome validado
    const { nome } = valida.data

    try {
        // Atualiza o restaurante identificado pelo ID
        const restaurante = await prisma.restaurante.update({
            where: {id:Number(id)}, // Converte ID de string para número
            data: { nome }          // Novo valor para o nome
        })
        // Retorna o restaurante atualizado com código 200 (OK)
        res.status(200).json(restaurante)
    } catch (error) {
        // Em caso de erro, retorna código 400 (Requisição Inválida)
        res.status(400).json({ error})
    }
})

// ===== EXPORTAÇÃO DA ROTA =====
// Exporta o router para que possa ser importado e usado na aplicação principal
export default router
