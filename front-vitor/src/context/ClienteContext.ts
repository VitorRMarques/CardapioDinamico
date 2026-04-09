// ===== IMPORTAÇÕES =====
// Importa tipo ClienteType para tipagem
import type { ClienteType } from "../util/ClienteType"
// Importa create do Zustand para criar store global
import { create } from "zustand"

// ===== TIPOS =====
// Define estrutura do store de cliente
type ClienteStore = {
    // Estado: dados do cliente autenticado
    cliente: ClienteType
    // Ação: faz login do cliente
    logaCliente: (clienteLogado: ClienteType) => void
    // Ação: faz logout do cliente
    deslogaCliente: () => void
}

// ===== ZUSTAND STORE: USE CLIENTE STORE =====
// Cria store global de cliente usando Zustand
// Permite acessar e modificar dados do cliente de qualquer componente
export const useClienteStore = create<ClienteStore>
((set) => ({
    // Estado inicial: cliente vazio
    cliente: {} as ClienteType,
    
    /**
     * Função: LOGA CLIENTE
     * Atualiza o estado global com dados do cliente autenticado
     * @param clienteLogado - Objeto com id, nome, email e token do cliente
     */
    logaCliente: (clienteLogado) => set({cliente: clienteLogado}),
    
    /**
     * Função: DESLOGA CLIENTE
     * Limpa o estado global removendo dados do cliente
     * Equivale a fazer login com objeto vazio
     */
    deslogaCliente: () => set({cliente: {} as ClienteType})

}))