import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"

const router = Router()

const pedidoSchema = z.object({
    produtoId: z.number().int().positive()
})

router.post("/", async (req, res) => {
    const { produtoId } = req.body
    const clienteId = (req as any).clienteId || req.body.clienteId // from middleware

    console.log('clienteId:', clienteId, 'produtoId:', produtoId)

    if (!clienteId) {
        return res.status(401).json({ erro: 'Cliente não autenticado' })
    }

    try {
        pedidoSchema.parse({ produtoId })

        const pedido = await prisma.pedido.create({
            data: {
                clienteId,
                produtoId
            },
            include: {
                produto: {
                    include: { restaurante: true }
                },
                cliente: true
            }
        })

        res.status(201).json(pedido)
    } catch (error) {
        console.error('Erro ao criar pedido:', error)
        if (error instanceof z.ZodError) {
            res.status(400).json({ erro: error.errors })
        } else {
            res.status(400).json({ erro: error.message || error })
        }
    }
})

router.get("/", async (req, res) => {
    const clienteId = (req as any).clienteId || req.body.clienteId

    if (!clienteId) {
        return res.status(401).json({ erro: 'Cliente não autenticado' })
    }

    try {
        const pedidos = await prisma.pedido.findMany({
            where: { clienteId },
            include: {
                produto: {
                    include: { restaurante: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json(pedidos)
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router