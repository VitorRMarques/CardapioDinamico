import express from 'express'
import cors from 'cors'

import routerProdutos from './routes/produtos'
import routerRestaurantes from './routes/restaurantes'
import routerClientes from './routes/clientes'
import routerLogin from './routes/login'    

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('API: Cardapio Flexivel')
})

app.use('/produtos', routerProdutos)
app.use('/restaurantes', routerRestaurantes)
app.use('/clientes', routerClientes)
app.use('/login', routerLogin)

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})