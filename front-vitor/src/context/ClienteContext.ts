import type { ClienteType } from "../util/ClienteType"
import { create } from "zustand"

type ClienteStore = {
    cliente: ClienteType
    logaCliente: (clienteLogado: ClienteType) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: (() => {
        // Reidrata do localStorage ao inicializar
        try {
            const salvo = localStorage.getItem("clienteKey")
            return salvo ? JSON.parse(salvo) : {} as ClienteType
        } catch {
            return {} as ClienteType
        }
    })(),
    logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
    deslogaCliente: () => {
        localStorage.removeItem("clienteKey")
        set({ cliente: {} as ClienteType })
    }
}))