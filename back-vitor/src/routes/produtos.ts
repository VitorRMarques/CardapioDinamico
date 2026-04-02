import { prisma } from "../../lib/prisma"
import { Tipo } from "../generated/prisma/enums"

import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const produtoSchema = z.object({
    descricao: z.string().min(3,
        { message: "A descricao deve possuir pelo menos 3 caracteres"},
    ),
    preco: z.number(),
    foto: z.string(),
    ingredientes: z.string().nullable().optional(),
    Tipo: z.enum(Tipo).optional(),
    tempoPreparo: z.number().nullable().optional(),
    status: z.boolean(),
    restauranteId: z.number(),
})

router.get("/", async (req, res) => {
    try {
        const produto = await prisma.produto.findMany({
            include: {
                restaurante: true,
            }
        })
        res.status(200).json(produto)
    } catch (error) {
        res.status(500).json({ erro: error})
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const produto = await prisma.produto.findFirst({
            where: {id: Number(id)},
            include: {
                restaurante: true
            }
        })
        res.status(200).json(produto)
    } catch(error) {
        res.status(500).json({erro: error})
    }
})

router.post("/", async (req, res) => {

    const valida = produtoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error})
        return 
    }

    const {descricao, preco, foto, ingredientes = null, Tipo = 'SALGADA', tempoPreparo = null, status,  restauranteId } = valida.data

    try {
        const produto = await prisma.produto.create({
            data: {
                descricao, preco, foto, ingredientes, Tipo, tempoPreparo, status, restauranteId
            }
        })
        res.status(201).json(produto)
    } catch (error) {
        res.status(400).json({error})
    }
})

router.delete("/:id", async (req, res) => {
    const {id} = req.params

    try {
        const produto = await prisma.produto.delete({
            where: {id: Number(id)}
        })
        res.status(200).json(produto)
    } catch (error) {
        res.status(400).json({ erro: error})
    }
})

router.put("/:id", async (req,res) => {
    const { id } = req.params

    const valida = produtoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(201).json({ erro: valida.error })
        return
    }

    const { descricao, preco, foto, ingredientes, Tipo, status, restauranteId} = valida.data

    try {
        const produto = await prisma.produto.update({
            where: { id: Number(id)},
            data: {
                descricao, preco, foto, ingredientes, Tipo, status, restauranteId
            }
        })
        res.status(200).json(produto)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get("/pesquisa/:termo", async (req, res) => {
    const { termo } = req.params

    const termoNumero = Number(termo)

    if (Number.isNaN(termoNumero)) {
        try {
            const produtos = await prisma.produto.findMany({
                include: {
                    restaurante: true,
                },
                where: {
                    OR: [
                        { descricao: {contains: termo, mode: "insensitive"} },
                        { restaurante: { nome: {equals: termo, mode: "insensitive"} } }
                    ]
                }
            })
            res.status(200).json(produtos)
        } catch (error) {
            res.status(500).json({ erro: error })
        }
    } else {
        if (termoNumero <= 1000) {
            try {
                const produtos = await prisma.produto.findMany({
                    include: {
                        restaurante: true,
                    },
                    where: {preco: {lte: termoNumero}}
                })
                res.status(200).json(produtos)
            } catch (error) {
                res.status(500).json({ erro: error})
            }
        }
    }
})

export default router
