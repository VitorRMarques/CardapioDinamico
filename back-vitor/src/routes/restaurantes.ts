import {prisma} from "../../lib/prisma"

import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const restauranteSchema = z.object({
    nome: z.string().min(3, 
        {message: "Modelo deve possuir pelo menos 3 caracteres"}
    )
})

router.get("/", async (req, res) => {
    try {
        const restaurantes = await prisma.restaurante.findMany()
        res.status(200).json(restaurantes)
    } catch (error) {
        res.status(500).json({ erro: error }) 
    }
})

router.post("/", async (req, res) => {
    const valida = restauranteSchema.safeParse(req.body)
    if (!valida.success){
        res.status(400).json({ erro: valida.error })
        return
    }

    const {nome} = valida.data

    try{
        const restaurante = await prisma.restaurante.create({
            data: {nome}
        })
        res.status(201).json(restaurante)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const restaurante = await prisma.restaurante.delete({
            where: {id: Number(id)}
        })
        res.status(200).json(restaurante)
    } catch (error) {
        res.status(400).json({ error})
    }
})

router.put("/:id", async (req, res) => {
    const {id} = req.params

    const valida = restauranteSchema.safeParse(req.body)
    if (!valida.success){
        res.status(400).json({ erro: valida.error})
        return 
    }

    const { nome } = valida.data

    try {
        const restaurante = await prisma.restaurante.update({
            where: {id:Number(id)},
            data: { nome }
        })
        res.status(200).json(restaurante)
    } catch (error) {
        res.status(400).json({ error})
    }
})

export default router
