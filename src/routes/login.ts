// ===== IMPORTAÇÕES =====
// Importa o JWT (JSON Web Token) para criar tokens de autenticação
import jwt from "jsonwebtoken"
// Importa a instância do Prisma para operações de banco de dados
import { prisma } from "../../lib/prisma"
// Importa o Router do Express para gerenciar rotas HTTP
import { Router } from "express"
// Importa bcrypt para verificar senhas criptografadas
import bcrypt from "bcrypt"

// ===== INICIALIZAÇÃO DA ROTA =====
// Cria uma instância do router do Express para gerenciar as rotas de autenticação/login
const router = Router()

// ===== ROTA POST / =====
// Faz login de um cliente (autentica credenciais e retorna JWT)
// Método: POST | Endpoint: /
// Body: Objeto com email e senha do cliente
// Retorna: Dados do cliente e token JWT para autenticação futura
router.post("/", async (req, res) => {
    // Extrai email e senha do corpo da requisição
    const { email, senha } = req.body

    // Mensagem padrão genérica para não revelar qual campo está incorreto
    // (segurança: impede descobrir emails válidos)
    const mensaPadrao = "Login ou senha incorretos."

    // Verifica se email e senha foram fornecidos
    if (!email || !senha) {
        // Retorna código 400 (Requisição Inválida)
        res.status(400).json({ erro: mensaPadrao })
        return
    }

    try {
        // Busca o cliente com o email fornecido no banco de dados
        const cliente = await prisma.cliente.findFirst({
            where: { email }
        })

        // Se cliente não foi encontrado (email não existe)
        if ( cliente == null ) {
            // Retorna código 401 (Não Autorizado) com mensagem genérica
            res.status(401).json({ erro: mensaPadrao })
            return
        }

        // Verifica se a senha fornecida corresponde à senha criptografada no banco
        if (bcrypt.compareSync(senha, cliente.senha)) {
            // Cria um token JWT com os dados do cliente logado
            const token = jwt.sign({
                // Payload do token - informações que serão codificadas
                clienteLogadoId: cliente.id, role: cliente.role,    // ID do cliente logado
                clienteLogadoNome: cliente.nome // Nome do cliente logado
            },
              process.env.JWT_KEY as string, // Chave secreta para assinar o token (variável de ambiente)
              { expiresIn: "24h" }             // Token expira em 24 horas
            )

            // Retorna os dados do cliente e o token com código 200 (OK)
            res.status(200).json({ 
                id: cliente.id,             // ID do cliente
                nome: cliente.nome,         // Nome do cliente
                email: cliente.email,       // Email do cliente
                role: cliente.role,
                token                       // Token JWT para futuras requisições
            })
        } else {
            // Senha incorreta - retorna mensagem genérica
            res.status(400).json({ erro: mensaPadrao })
        }
    } catch (error) {
        // Em caso de erro no servidor, retorna código 400
        res.status(400).json(error)
    }
})

// ===== EXPORTAÇÃO DA ROTA =====
// Exporta o router para que possa ser importado e usado na aplicação principal
export default router