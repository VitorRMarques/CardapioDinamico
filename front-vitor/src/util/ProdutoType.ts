// ===== IMPORTAÇÕES =====
// Importa tipo RestauranteType para tipagem
import type { RestauranteType } from "./RestauranteType";

// ===== TIPO: PRODUTO =====
// Define a estrutura de dados de um produto no cardápio
export type ProdutoType = {
    id: number              // ID único do produto
    descricao: string       // Descrição/nome do produto
    preco: number           // Preço do produto em Real
    foto: string            // URL da foto/imagem do produto
    ingredientes: string    // Lista de ingredientes do produto
    Tipo: string            // Tipo do produto (ex: prato principal, sobremesa, bebida)
    tempoPreparo: number | null  // Tempo de preparo em minutos (pode ser null)
    createdAt: Date         // Data de criação do produto
    updatedAt: Date         // Data da última atualização
    status: boolean         // Status ativo/inativo do produto
    restauranteId: number   // ID do restaurante que oferece este produto
    restaurante: RestauranteType  // Objeto completo do restaurante (relacionamento)
}