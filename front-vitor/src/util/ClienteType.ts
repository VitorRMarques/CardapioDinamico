// ===== TIPO: CLIENTE =====
// Define a estrutura de dados de um cliente autenticado
export type ClienteType = {
    id: string           // ID único do cliente (UUID ou similar)
    nome: string         // Nome completo do cliente
    email: string        // Email do cliente (usado para login)
    token?: string      // Token JWT de autenticação (opcional, presente quando cliente está logado)
    role: string        // Papel do cliente (ex: "USER", "ADMIN")
}