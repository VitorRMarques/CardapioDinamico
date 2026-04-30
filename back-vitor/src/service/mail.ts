import nodemailer from 'nodemailer'

export type PedidoWithClienteProduto = {
    cliente: {
        email: string
        nome: string
    }
    produto: {
        descricao: string
        restaurante: {
            nome: string
        }
        preco: number | string | { toNumber(): number }
    }
    observacao?: string | null
    createdAt: Date | string
}

export const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAILTRAP_PORT || '2525'),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

transporter.verify().then(() => {
    console.log('Mailtrap transporter verificado com sucesso')
}).catch(error => {
    console.error('Erro ao verificar transporter Mailtrap:', error)
})

export async function sendOrderConfirmationEmail(pedido: PedidoWithClienteProduto) {
    return transporter.sendMail({
        from: 'no-reply@cardapiodinamico.com',
        to: pedido.cliente.email,
        subject: 'Confirmação de pedido recebido',
        html: `
            <p>Olá <strong>${pedido.cliente.nome}</strong>,</p>
            <p>Seu pedido foi recebido com sucesso!</p>
            <ul>
                <li><strong>Pedido:</strong> ${pedido.produto.descricao}</li>
                <li><strong>Restaurante:</strong> ${pedido.produto.restaurante.nome}</li>
                <li><strong>Preço:</strong> R$ ${Number(pedido.produto.preco).toLocaleString('pt-br', { minimumFractionDigits: 2 })}</li>
                <li><strong>Observação:</strong> ${pedido.observacao || 'Sem observação'}</li>
                <li><strong>Data do pedido:</strong> ${new Date(pedido.createdAt).toLocaleString('pt-br')}</li>
            </ul>
            <p>Obrigado por comprar conosco.</p>
        `
    })
}

export async function sendOrderReadyOnBenchEmail(pedido: PedidoWithClienteProduto) {
    return transporter.sendMail({
        from: 'no-reply@cardapiodinamico.com',
        to: pedido.cliente.email,
        subject: 'Seu pedido está na bancada',
        html: `
            <p>Olá <strong>${pedido.cliente.nome}</strong>,</p>
            <p>Seu pedido está na bancada e em breve ficará pronto para entrega.</p>
            <ul>
                <li><strong>Pedido:</strong> ${pedido.produto.descricao}</li>
                <li><strong>Restaurante:</strong> ${pedido.produto.restaurante.nome}</li>
                <li><strong>Observação:</strong> ${pedido.observacao || 'Sem observação'}</li>
            </ul>
            <p>Boas refeições!</p>
        `
    })
}
