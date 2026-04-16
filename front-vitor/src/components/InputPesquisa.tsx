import { useEffect, useState } from "react";
import type { ProdutoType } from "../util/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type Props = {
    setProdutos: (produtos: ProdutoType[]) => void
}

export function InputPesquisa({ setProdutos }: Props) {
    const [todos, setTodos] = useState<ProdutoType[]>([])
    const [termo, setTermo] = useState("")

    // Carrega todos os produtos uma vez
    useEffect(() => {
        async function carrega() {
            const response = await fetch(`${apiUrl}/produtos`)
            const dados = await response.json()
            setTodos(dados)
            setProdutos(dados)
        }
        carrega()
    }, [])

    // Filtra localmente a cada keystroke
    useEffect(() => {
        if (!termo.trim()) {
            setProdutos(todos)
            return
        }

        const t = termo.toLowerCase()
        const filtrados = todos.filter(p =>
            p.restaurante.nome.toLowerCase().includes(t) ||
            p.descricao.toLowerCase().includes(t)        ||
            p.ingredientes.toLowerCase().includes(t)     ||
            p.Tipo.toLowerCase().includes(t)
        )
        setProdutos(filtrados)
    }, [termo, todos])

    return (
        <div className="relative w-full">
            <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
                type="text"
                value={termo}
                onChange={e => setTermo(e.target.value)}
                placeholder="Buscar por restaurante, prato, ingrediente ou tipo..."
                className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {termo && (
                <button
                    onClick={() => setTermo("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                    ✕
                </button>
            )}
        </div>
    )
}