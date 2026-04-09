import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import routerProdutos from './routes/produtos'
import routerRestaurantes from './routes/restaurantes'
import routerClientes from './routes/clientes'
import routerLogin from './routes/login'
import routerPedidos from './routes/pedidos'    

const app = express()
const port = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))     
app.use(express.json())

// Middleware para verificar JWT
const verificarToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' })
    }

    const jwtKey = process.env.JWT_KEY
    if (!jwtKey) {
        console.error('JWT_KEY não configurada')
        return res.status(500).json({ erro: 'Chave JWT não configurada' })
    }

    try {
        const decoded = jwt.verify(token, jwtKey) as any
        ;(req as any).clienteId = decoded.clienteLogadoId
        console.log('Token verificado, clienteId:', (req as any).clienteId)
        next()
    } catch (error) {
        console.error('Erro ao verificar token:', error)
        res.status(401).json({ erro: 'Token inválido' })
    }
}

app.get('/', (req, res) => {
    res.send('API: Cardapio Flexivel')
})

app.use('/produtos', routerProdutos)
app.use('/restaurantes', routerRestaurantes)
app.use('/clientes', routerClientes)
app.use('/clientes/login', routerLogin)
app.use('/pedidos', verificarToken, routerPedidos)

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})