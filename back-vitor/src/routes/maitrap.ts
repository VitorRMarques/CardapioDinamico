import { Router } from "express"

const router = Router()

router.get("/mensagens", async (req, res) => {
    const clienteRole = (req as any).clienteRole

    if (clienteRole !== "ADMIN") {
        return res.status(403).json({ erro: "Acesso negado." })
    }

    try {
        const inboxId = process.env.MAILTRAP_INBOX_ID
        const apiToken = process.env.MAILTRAP_API_TOKEN

        const response = await fetch(
            `https://mailtrap.io/api/v1/inboxes/${inboxId}/messages`,
            {
                headers: {
                    "Api-Token": apiToken as string
                }
            }
        )

        if (!response.ok) {
            return res.status(response.status).json({ erro: "Erro ao buscar mensagens do Mailtrap" })
        }

        const mensagens = await response.json()
        res.status(200).json(mensagens)
    } catch (error) {
        res.status(500).json({ erro: "Erro interno ao buscar mensagens" })
    }
})

export default router