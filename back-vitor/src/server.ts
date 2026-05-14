import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import routerProdutos from './routes/produtos.js'
import routerRestaurantes from './routes/restaurantes.js'
import routerClientes from './routes/clientes.js'
import routerLogin from './routes/login.js'
import routerPedidos from './routes/pedidos.js'
import routerAdmin from './routes/admin.js'    
import routerMailtrap from './routes/maitrap.js'

const app = express()
const port = 3000

app.use(cors({
    origin: ['http://localhost:5173','https://cardapio-dinamico-front.vercel.app'],
    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
        ;(req as any).clienteRole = decoded.role
        console.log('Token verificado, clienteId:', (req as any).clienteId)
        next()
    } catch (error) {
        console.error('Erro ao verificar token:', error)
        res.status(401).json({ erro: 'Token inválido' })
    }
}

app.use('/mailtrap', verificarToken, routerMailtrap)

app.get('/', (req, res) => {
    res.send('API: Cardapio Flexivel')
})

app.use('/produtos', routerProdutos)
app.use('/restaurantes', routerRestaurantes)
app.use('/clientes', routerClientes)
app.use('/clientes/login', routerLogin)
app.use('/pedidos', verificarToken, routerPedidos)
app.use('/admin', verificarToken, routerAdmin)


export default app