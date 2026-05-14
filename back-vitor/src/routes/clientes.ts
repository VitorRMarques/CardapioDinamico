// ===== IMPORTAÇÕES =====
// Importa a instância do Prisma para operações de banco de dados
import { prisma } from "../../lib/prisma.js"
// Importa o Router do Express para gerenciar rotas HTTP
import { Router } from "express"
// Importa bcrypt para criptografia de senhas
import bcrypt from "bcrypt"
// Importa o Zod para validação de esquemas de dados
import {  z } from "zod"

// ===== INICIALIZAÇÃO DA ROTA =====
// Cria uma instância do router do Express para gerenciar as rotas de clientes
const router = Router()

// ===== VALIDAÇÃO COM ZOD =====
// Define o esquema de validação para dados do cliente
// Garante que os dados enviados atendem aos requisitos obrigatórios
const clienteSchema = z.object({
    // Nome do cliente - string com mínimo de 10 caracteres
    nome: z.string().min(10, {
        message: "O nome deve conter no mínimo 10 caracteres."
    }),
    // Email do cliente - deve ser um email válido
    email: z.string().email({
        message: "O email deve ser válido."
    }),
    // Senha do cliente - será validada separadamente por função específica
    senha: z.string(),
})


// ===== ROTA GET / =====
// Busca todos os clientes cadastrados no banco de dados
// Método: GET | Endpoint: /
// Retorna: Array de todos os clientes
router.get("/", async (req, res) => {
    try {
        // Busca todos os registros da tabela cliente
        const clientes = await prisma.cliente.findMany()
        // Retorna os clientes com código 200 (OK)
        res.status(200).json(clientes)
    } catch (error) {
        // Em caso de erro, retorna código 400 (Requisição Inválida)
        res.status(400).json(error)
    }
})

// ===== FUNÇÃO: VALIDA SENHA =====
// Valida a força da senha verificando múltiplos critérios de segurança
// Retorna: Array de mensagens de erro se a senha não atender aos critérios
function validaSenha(senha: string) {
    // Array para armazenar mensagens de erro encontradas
    const mensa: string[] = []

    // Verifica se a senha tem no mínimo 8 caracteres
    if (senha.length < 8) {
        mensa.push("A senha deve conter no mínimo 8 caracteres.")
    }

    // Contadores para verificar tipos de caracteres
    let pequenas = 0  // Letras minúsculas
    let grandes = 0   // Letras maiúsculas
    let numeros = 0   // Números
    let simbolos = 0  // Caracteres especiais

    // Percorre cada caractere da senha
    for (const letra of senha) {
        // Verifica se é letra minúscula [a-z]
        if ((/[a-z]/).test(letra)) {
            pequenas++
        // Verifica se é letra maiúscula [A-Z]
        }else if ((/[A-Z]/).test(letra)) {
            grandes++
        // Verifica se é número [0-9]
        }else if ((/[0-9]/).test(letra)) {
            numeros++
        // Verifica se é símbolo (qualquer coisa que não seja letra ou número)
        }else if ((/[^a-zA-Z0-9]/).test(letra)) {
            simbolos++
        }
    }

    // Adiciona mensagens de erro se forem encontrados problemas
    if (pequenas === 0) {
        mensa.push("A senha deve conter pelo menos uma letra minúscula.")
    }
    if (grandes === 0) {
        mensa.push("A senha deve conter pelo menos uma letra maiúscula.")
    }
    if (numeros === 0) {
        mensa.push("A senha deve conter pelo menos um número.")
    }
    if (simbolos === 0) {
        mensa.push("A senha deve conter pelo menos um símbolo.")
    }

    // Retorna o array de erros (vazio se senha for válida)
    return mensa;
}

// ===== ROTA POST / =====
// Cria um novo cliente (Registro/Cadastro)
// Método: POST | Endpoint: /
// Body: Objeto cliente com nome, email e senha
// Retorna: Cliente criado com ID gerado (sem a senha)
router.post("/", async (req, res) => {
    // Valida os dados recebidos contra o schema definido
    const valida = clienteSchema.safeParse(req.body)

    // Se a validação falhar, retorna erro 400 com detalhes
    if (!valida.success) {
        res.status(400).json(valida.error)
        return
    }

    // Valida a força/requisitos da senha
    const erros = validaSenha(valida.data.senha)
    if (erros.length > 0) {
        // Se houver erros de validação da senha, retorna código 400
        res.status(400).json({ erro: erros.join("; ")})
        return
    }

    // Gera um "salt" para aumentar a segurança do hash (12 é o número de rounds)
    const salt = bcrypt.genSaltSync(12)
    // Criptografa a senha usando o salt gerado
    const hash = bcrypt.hashSync(valida.data.senha, salt)
    // Extrai nome e email dos dados validados
    const { nome, email } = valida.data

    try {
        // Cria um novo cliente no banco de dados
        const cliente = await prisma.cliente.create({
            data: { nome, email, senha: hash } // Armazena a senha criptografada
        })
        // Retorna o cliente criado com código 201 (Criado)
        res.status(201).json(cliente)
    } catch (error) {
        // Em caso de erro (ex: email já existe), retorna código 400
        res.status(400).json(error)
    }
})

// ===== ROTA GET /:id =====
// Busca um cliente específico pelo seu ID
// Método: GET | Endpoint: /:id
// Parâmetro: id (string do ID do cliente)
// Retorna: Objeto do cliente encontrado ou erro se não existir
router.get("/:id", async (req, res) => {
    // Extrai o ID dos parâmetros da URL
    const { id } = req.params
    try {
        // Busca o cliente com ID único específico
        const cliente = await prisma.cliente.findUnique({
            where: { id } // ID é a chave primária (unique)
        })
        // Retorna o cliente encontrado
        res.status(200).json(cliente)
    } catch (error) {
        // Em caso de erro, retorna código 400
        res.status(400).json(error)
    }
})

// ===== EXPORTAÇÃO DA ROTA =====
// Exporta o router para que possa ser importado e usado na aplicação principal
export default router