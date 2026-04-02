import type { RestauranteType } from "./RestauranteType";

export type ProdutoType = {
    id: number
    descricao: string
    preco: number
    foto: string
    ingredientes: string
    Tipo: string
    tempoPreparo: number | null
    createdAt: Date
    updatedAt: Date
    status: boolean
    restauranteId: number
    restaurante: RestauranteType

}