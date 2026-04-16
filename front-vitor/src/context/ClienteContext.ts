import type { ClienteType } from "../util/ClienteType"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type ClienteStore = {
    cliente: ClienteType
    logaCliente: (clienteLogado: ClienteType) => void
    deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>()(
    persist(
        (set) => ({
            cliente: {} as ClienteType,
            logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
            deslogaCliente: () => set({ cliente: {} as ClienteType })
        }),
        {
            name: "clienteKey", // chave no localStorage
        }
    )
)