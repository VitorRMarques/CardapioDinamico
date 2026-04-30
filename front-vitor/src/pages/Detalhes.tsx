import type { ProdutoType } from ".././util/ProdutoType";
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useClienteStore } from ".././context/ClienteContext";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
    cliente: { id: string, nome: string, email: string }
    observacao?: string
    status: 'PENDENTE' | 'PRONTO' | 'ENTREGUE'
}

export default function Detalhes(data: PedidoType) {
    const params = useParams()
    const navigate = useNavigate();
    const [produto, setProduto] = useState<ProdutoType>()
    const [observacao, setObservacao] = useState(data.observacao ?? '')
    const { cliente } = useClienteStore()

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
            const dados = await response.json()
            setProduto(dados)
        }
        buscaDados()
    }, [params.produtoId])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // Redireciona para login se não autenticado
        if (!cliente.token) {
            toast.error('Faça login para realizar um pedido.')
            navigate('/login')
            return
        }

        try {
            const response = await fetch(`${apiUrl}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cliente.token}`
                },
                body: JSON.stringify({ produtoId: parseInt(params.produtoId!), observacao: observacao || '' })
            })

            if (response.ok) {
                toast.success('Pedido realizado com sucesso!')
                navigate('/perfil')
            } else {
                const error = await response.json()
                toast.error(error.erro || error.message || 'Erro ao realizar pedido')
            }
        } catch {
            toast.error('Erro de conexão')
        }
    }

    const logado = !!cliente.email

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">

            {/* Cabeçalho */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm font-medium tracking-widest text-purple-600 uppercase mb-3">
                        {produto?.restaurante?.nome ?? '...'}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {produto?.descricao ?? 'Carregando...'}
                    </h1>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        R$ {Number(produto?.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Coluna esquerda — imagem + info */}
                <div className="flex flex-col gap-5">
                    <div className="relative rounded-xl overflow-hidden">
                        <img
                            src={produto?.foto}
                            alt={produto?.descricao}
                            className="w-full h-72 object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {produto?.restaurante?.nome}
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-medium">
                            {produto?.Tipo}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-0.5 rounded-full">
                            ⏱ {produto?.tempoPreparo} min
                        </span>
                        {produto?.status && (
                            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2.5 py-0.5 rounded-full">
                                {produto.status}
                            </span>
                        )}
                    </div>

                    {/* Ingredientes */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Ingredientes</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {produto?.ingredientes}
                        </p>
                    </div>
                </div>

                {/* Coluna direita — pedido */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-5 h-fit">

                    {logado ? (
                        // Usuário logado — exibe formulário
                        <>
                            <div>
                                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">Fazendo pedido como</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{cliente.nome}</p>
                                <p className="text-xs text-gray-500">{cliente.email}</p>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800" />

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label  className="block text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
                                        Observações
                                    </label>
                                    <textarea
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
                                        name="observacao"
                                        rows={4}
                                        placeholder="Ex: sem cebola, ponto da carne, molho à parte..."
                                        className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition placeholder-gray-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Confirmar pedido
                                </button>
                            </form>
                        </>
                    ) : (
                        // Usuário não logado — convite para login
                        <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xl">
                                🔒
                            </div>
                            <div>
                                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                    Quer fazer este pedido?
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Faça login ou cadastre-se para continuar
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 w-full pt-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => navigate('/cadastro')}
                                    className="w-full py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Criar conta
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}