import { useEffect, useState } from "react";
import { useClienteStore } from ".././context/ClienteContext";
import { useNavigate } from "react-router-dom";
import type { ProdutoType } from ".././util/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
    observacao?: string
    status: 'PENDENTE' | 'PRONTO' | 'ENTREGUE'
}

export default function Perfil() {
    const { cliente } = useClienteStore();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState<PedidoType[]>([]);

    useEffect(() => {
        if (!cliente.email) {
            navigate('/login');
            return;
        }

        async function buscaPedidos() {
            if (!cliente.token) return

            try {
                const response = await fetch(`${apiUrl}/pedidos`, {
                    headers: { 'Authorization': `Bearer ${cliente.token}` }
                });

                if (response.ok) {
                    const todosPedidos = await response.json();
                    const pedidosPendentes = todosPedidos.filter((p: PedidoType) => p.status === 'PENDENTE');
                    setPedidos(pedidosPendentes);
                } else if (response.status === 401) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Erro de conexão', error);
            }
        }

        buscaPedidos();
    }, [cliente, navigate]);

    async function excluirPedido(pedidoId: number) {
        if (!cliente.token) return
        if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return

        try {
            const response = await fetch(`${apiUrl}/pedidos/${pedidoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${cliente.token}` }
            })

            if (response.ok) {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId))
            } else if (response.status === 401) {
                navigate('/login')
            }
        } catch (error) {
            console.error('Erro de conexão', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">

            {/* Cabeçalho */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-12 text-center">
                    <p className="text-sm font-medium tracking-widest text-purple-600 uppercase mb-3">
                        Sua conta
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Meus Pedidos
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Olá, <span className="font-medium text-gray-700 dark:text-gray-300">{cliente.nome}</span>
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                {pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <p className="text-lg">Você ainda não fez nenhum pedido.</p>
                        <p className="text-sm mt-1">Explore o cardápio e faça seu primeiro pedido!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Ver cardápio
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Imagem */}
                                <div className="relative">
                                    <img
                                        src={pedido.produto.foto}
                                        alt={pedido.produto.descricao}
                                        className="w-full h-48 object-cover"
                                    />
                                    <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        {pedido.produto.restaurante.nome}
                                    </span>
                                </div>

                                {/* Conteúdo */}
                                <div className="p-4 flex flex-col gap-3 flex-1">

                                    {/* Descrição + preço */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                                            {pedido.produto.descricao}
                                        </h2>
                                        <span className="text-base font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                                            R$ {Number(pedido.produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-medium">
                                            {pedido.produto.Tipo}
                                        </span>
                                        <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-0.5 rounded-full">
                                            ⏱ {pedido.produto.tempoPreparo} min
                                        </span>
                                    </div>

                                    {/* Data */}
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Pedido em {new Date(pedido.createdAt).toLocaleString("pt-br")}
                                    </p>

                                    {/* Botão cancelar */}
                                    <button
                                        onClick={() => excluirPedido(pedido.id)}
                                        className="mt-auto w-full py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Cancelar pedido
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}