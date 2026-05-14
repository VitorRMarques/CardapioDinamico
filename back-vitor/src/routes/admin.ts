import { prisma } from "../../lib/prisma.js"
import { Router } from "express"
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { sendOrderCanceledEmail } from '../service/mail.js'

const router = Router()

const adminSchema = z.object({
  nome: z.string().min(10,
    { message: "Nome deve possuir, no mínimo, 10 caracteres" }),
  email: z.email(),
  senha: z.string(),
  nivel: z.number()
    .min(1, { message: "Nível, no mínimo, 1" })
    .max(5, { message: "Nível, no máximo, 5" })
})

router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany()
    res.status(200).json(admins)
  } catch (error) {
    res.status(400).json(error)
  }
})

function validaSenha(senha: string) {

  const mensa: string[] = []

  // .length: retorna o tamanho da string (da senha)
  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  // contadores
  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  // senha = "abc123"
  // letra = "a"

  // percorre as letras da variável senha
  for (const letra of senha) {
    // expressão regular
    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0) {
    mensa.push("Erro... senha deve possuir letra(s) minúscula(s)")
  }

  if (grandes == 0) {
    mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)")
  }

  if (numeros == 0) {
    mensa.push("Erro... senha deve possuir número(s)")
  }

  if (simbolos == 0) {
    mensa.push("Erro... senha deve possuir símbolo(s)")
  }

  return mensa
}

router.post("/", async (req, res) => {

  const valida = adminSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const erros = validaSenha(valida.data.senha)
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") })
    return
  }

  // 12 é o número de voltas (repetições) que o algoritmo faz
  // para gerar o salt (sal/tempero)
  const salt = bcrypt.genSaltSync(12)
  // gera o hash da senha acrescida do salt
  const hash = bcrypt.hashSync(valida.data.senha, salt)

  const { nome, email, nivel } = valida.data

  // para o campo senha, atribui o hash gerado
  try {
    const admin = await prisma.admin.create({
      data: { nome, email, senha: hash, nivel }
    })
    res.status(201).json(admin)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const admin = await prisma.admin.findFirst({
      where: { id }
    })
    res.status(200).json(admin)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pedidos/todos", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: {
          select: {id: true, nome:true, email: true}
        },
        produto: {
          select: {
            id: true,
            descricao: true,
            preco: true,
            foto: true,
            Tipo: true,
            tempoPreparo: true,
            restaurante: {
              select: {nome: true}
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(pedidos)
  } catch(error) {
    console.error('Erro ao buscar pedidos:', error)
    res.status(400).json({ erro: 'Erro ao buscar pedidos' })
  }
})

router.delete('/pedidos/:id', async (req, res) => {
  const clienteRole = (req as any).clienteRole
  const pedidoId = Number(req.params.id)

  if (clienteRole !== 'ADMIN') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' })
  }

  if (Number.isNaN(pedidoId)) {
    return res.status(400).json({ erro: 'ID do pedido inválido' })
  }

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        cliente: true,
        produto: {
          include: { restaurante: true }
        }
      }
    })

    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' })
    }

    await prisma.pedido.delete({ where: { id: pedidoId } })

    try {
      const info = await sendOrderCanceledEmail(pedido)
      console.log('Email de cancelamento enviado:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      })
    } catch (mailError) {
      console.error('Erro ao enviar email de cancelamento:', mailError)
    }

    res.status(200).json({ message: 'Pedido excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    res.status(500).json({ erro: 'Erro interno do servidor' })
  }
})

export default router
