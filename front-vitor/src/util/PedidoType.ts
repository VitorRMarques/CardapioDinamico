import type { ClienteType } from "./ClienteType"
import type { ProdutoType } from "./ProdutoType"

export type Pedido =  {
    id: number
    clienteId: string
    cliente: ClienteType
    produtoId: number
    produto: ProdutoType
    createdAt: string
    updatedAt: string
}