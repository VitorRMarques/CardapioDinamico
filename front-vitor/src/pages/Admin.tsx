import { useEffect, useState } from "react"
import { useClienteStore } from "../context/ClienteContext"
import { useNavigate } from "react-router-dom"
import Graficos from "./Graficos"

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

type PedidoAdmin = {
    id: number
    createdAt: string
    observacao?: string
    status: 'PENDENTE' | 'PRONTO' | 'ENTREGUE'
    cliente: { id: string, nome: string, email: string }
    produto: {
        id: number
        descricao: string
        preco: number
        foto: string
        Tipo: string
        tempoPreparo: number
        restaurante: { nome: string }
    }
}

export default function Admin() {
    const { cliente } = useClienteStore()
    const navigate = useNavigate()
    const [pedidos, setPedidos] = useState<PedidoAdmin[]>([])
    const [erro, setErro] = useState<string>("")
    const [carregando, setCarregando] = useState(true)
    const [aba, setAba] = useState<'pedidos' | 'graficos'>('pedidos')

    useEffect(() => {
        if (!cliente.token) { navigate('/login'); return }
        if (cliente.role !== "ADMIN") { navigate('/'); return }

        async function busca() {
            try {
                const response = await fetch(`${apiUrl}/admin/pedidos/todos`, {
                    headers: { 'Authorization': `Bearer ${cliente.token}` }
                })
                const json = await response.json()
                if (response.ok) {
                    setPedidos(json)
                } else {
                    setErro(json.erro || json.message || "Erro ao buscar pedidos")
                }
            } catch {
                setErro("Erro de conexão com o servidor")
            } finally {
                setCarregando(false)
            }
        }
        busca()
    }, [cliente.token])

    const pedidosPendentes = pedidos.filter(p => p.status === 'PENDENTE')

    const pedidosPorProduto = pedidosPendentes.reduce((acc, pedido) => {
        const key = pedido.produto.id
        if (!acc[key]) acc[key] = { produto: pedido.produto, pedidos: [] }
        acc[key].pedidos.push(pedido)
        return acc
    }, {} as Record<number, { produto: PedidoAdmin["produto"], pedidos: PedidoAdmin[] }>)

    async function marcarComoPronto(pedidoId: number) {
        try {
            const response = await fetch(`${apiUrl}/pedidos/${pedidoId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cliente.token}`
                },
                body: JSON.stringify({ status: 'PRONTO' })
            })
            if (response.ok) {
                setPedidos(prev => prev.map(p =>
                    p.id === pedidoId ? { ...p, status: 'PRONTO' } : p
                ))
            } else {
                const error = await response.json()
                alert(error.erro || 'Erro ao marcar pedido como pronto')
            }
        } catch {
            alert('Erro de conexão')
        }
    }

    async function excluirPedido(pedidoId: number) {
        if (!window.confirm('Deseja realmente excluir este pedido?')) return
        try {
            const response = await fetch(`${apiUrl}/admin/pedidos/${pedidoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${cliente.token}` }
            })
            if (response.ok) {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId))
            } else {
                const error = await response.json()
                alert(error.erro || 'Erro ao excluir pedido')
            }
        } catch {
            alert('Erro de conexão')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">

            {/* Cabeçalho */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm font-medium tracking-widest text-purple-600 uppercase mb-3">
                        Painel Administrativo
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {aba === 'pedidos' ? 'Controle de Pedidos' : 'Gráficos e Estatísticas'}
                    </h1>
                    {aba === 'pedidos' && (
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            {pedidosPendentes.length} pedido{pedidosPendentes.length !== 1 ? 's' : ''} pendente{pedidosPendentes.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Abas */}
                <div className="max-w-6xl mx-auto px-6">
                    <nav className="flex space-x-8">
                        {(['pedidos', 'graficos'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setAba(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                                    aba === tab
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab === 'pedidos' ? 'Pedidos' : 'Gráficos'}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-6xl mx-auto px-6 py-10">

                {aba === 'graficos' && <Graficos />}

                {aba === 'pedidos' && (
                    <>
                        {/* Estado de carregando */}
                        {carregando && (
                            <div className="flex justify-center py-24 text-gray-400">
                                <p>Carregando pedidos...</p>
                            </div>
                        )}

                        {/* Estado de erro */}
                        {erro && (
                            <div className="flex justify-center py-24">
                                <p className="text-red-500">{erro}</p>
                            </div>
                        )}

                        {!carregando && !erro && (
                            <>
                                {/* Cards agrupados por produto */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {Object.values(pedidosPorProduto).map(({ produto, pedidos }) => (
                                        <div
                                            key={produto.id}
                                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-sm"
                                        >
                                            {/* Imagem */}
                                            <div className="relative">
                                                <img
                                                    src={produto.foto}
                                                    alt={produto.descricao}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                    {produto.restaurante.nome}
                                                </span>
                                                <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                                    {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            {/* Info do produto */}
                                            <div className="p-4 flex flex-col gap-3 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                                                        {produto.descricao}
                                                    </h2>
                                                    <span className="text-base font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                                                        R$ {Number(produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-medium">
                                                        {produto.Tipo}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-0.5 rounded-full">
                                                        ⏱ {produto.tempoPreparo} min
                                                    </span>
                                                </div>

                                                {/* Lista de clientes que pediram */}
                                                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                                                    <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
                                                        Clientes que pediram
                                                    </p>
                                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                                        {pedidos.map(pedido => (
                                                            <div key={pedido.id} className="flex items-start justify-between gap-2 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                                                                        {pedido.cliente.nome}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {new Date(pedido.createdAt).toLocaleString("pt-br")}
                                                                    </p>
                                                                    {pedido.observacao && (
                                                                        <p className="text-xs text-gray-400 italic">
                                                                            "{pedido.observacao}"
                                                                        </p>
                                                                    )}
                                                                    <div className="flex gap-1.5 mt-1">
                                                                        <button
                                                                            onClick={() => marcarComoPronto(pedido.id)}
                                                                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded-md transition-colors"
                                                                        >
                                                                            Na bancada
                                                                        </button>
                                                                        <button
                                                                            onClick={() => excluirPedido(pedido.id)}
                                                                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-md transition-colors"
                                                                        >
                                                                            Excluir
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                                    #{pedido.id}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tabela completa */}
                                <div className="mt-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                            Todos os pedidos pendentes
                                        </h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-medium tracking-widest text-gray-400 uppercase text-left">
                                                    <th className="px-6 py-3">#</th>
                                                    <th className="px-6 py-3">Cliente</th>
                                                    <th className="px-6 py-3">Produto</th>
                                                    <th className="px-6 py-3">Restaurante</th>
                                                    <th className="px-6 py-3">Observação</th>
                                                    <th className="px-6 py-3">Preço</th>
                                                    <th className="px-6 py-3">Data</th>
                                                    <th className="px-6 py-3">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedidosPendentes.map((pedido, i) => (
                                                    <tr
                                                        key={pedido.id}
                                                        className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${i % 2 !== 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                                                    >
                                                        <td className="px-6 py-3 text-gray-400">#{pedido.id}</td>
                                                        <td className="px-6 py-3">
                                                            <p className="font-medium text-gray-900 dark:text-white">{pedido.cliente.nome}</p>
                                                            <p className="text-xs text-gray-400">{pedido.cliente.email}</p>
                                                        </td>
                                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{pedido.produto.descricao}</td>
                                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{pedido.produto.restaurante.nome}</td>
                                                        <td className="px-6 py-3 text-gray-500 dark:text-gray-400 italic max-w-xs break-words">
                                                            {pedido.observacao || '—'}
                                                        </td>
                                                        <td className="px-6 py-3 font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                                                            R$ {Number(pedido.produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                                                            {new Date(pedido.createdAt).toLocaleString("pt-br")}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div className="flex flex-col gap-1.5">
                                                                <button
                                                                    onClick={() => marcarComoPronto(pedido.id)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                                                >
                                                                    Na bancada
                                                                </button>
                                                                <button
                                                                    onClick={() => excluirPedido(pedido.id)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}