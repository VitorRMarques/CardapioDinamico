import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa";
import type { ProdutoType } from "./util/ProdutoType"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function App() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([])

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/produtos`)
            const dados = await response.json()
            setProdutos(dados)
        }
        buscaDados()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">

            {/* Cabeçalho */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm font-medium tracking-widest text-purple-600 uppercase mb-3">
                        Praça de alimentação
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Cardápio Dinâmico
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                        Escolha o que quiser, sem sair da fila
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