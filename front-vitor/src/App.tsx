import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa";
import type { ProdutoType } from "./util/ProdutoType"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function buscaDados() {
            try {
                setLoading(true)
                const response = await fetch(`${apiUrl}/produtos`)
                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.status}`)
                }
                const dados = await response.json()
                setProdutos(dados)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }
        buscaDados()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <p className="text-lg">Carregando produtos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-red-600 mb-2">Erro ao carregar produtos</p>
                    <p className="text-sm text-gray-500">{error}</p>
                    <p className="text-sm text-gray-500 mt-2">Verifique se o servidor backend está rodando em {apiUrl}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-200">

            {/* Cabeçalho */}
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm font-medium tracking-widest text-purple-600 uppercase mb-3">
                        Praça de alimentação
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Cardápio Dinâmico
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                        Escolha o que quiser
                    </p>
                    {/* Barra de pesquisa */}
                    <div className="max-w-xl mx-auto">
                        <InputPesquisa setProdutos={setProdutos} />
                    </div>
                </div>
            </div>

            {/* Grid de produtos */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                {produtos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <p className="text-lg">Nenhum produto encontrado.</p>
                        <p className="text-sm mt-1">Tente pesquisar por outro termo.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {produtos.map(produto => (
                            <CardProduto data={produto} key={produto.id} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}