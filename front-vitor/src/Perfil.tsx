import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import { useNavigate } from "react-router-dom";
import type { ProdutoType } from "./util/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
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
            if (!cliente.token) {
                console.error('Token não encontrado')
                return
            }

            try {
                const response = await fetch(`${apiUrl}/pedidos`, {
                    headers: {
                        'Authorization': `Bearer ${cliente.token}`
                    }
                });
                if (response.ok) {
                    const dados = await response.json();
                    setPedidos(dados);
                } else if (response.status === 401) {
                    console.warn('Token inválido ou expirado. Redirecionando para login.');
                    navigate('/login');
                } else {
                    const errorBody = await response.text();
                    console.error('Erro ao buscar pedidos:', response.status, errorBody);
                }
            } catch (error) {
                console.error('Erro de conexão', error);
            }
        }
        buscaPedidos();
    }, [cliente, navigate]);

    return (
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
            {pedidos.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                <div className="space-y-4">
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="border border-gray-300 rounded-lg p-4">
                            <h2 className="text-xl font-semibold">{pedido.produto.descricao}</h2>
                            <p>Restaurante: {pedido.produto.restaurante.nome}</p>
                            <p>Preço: R$ {Number(pedido.produto.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}</p>
                            <p>Data: {new Date(pedido.createdAt).toLocaleString("pt-br")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}