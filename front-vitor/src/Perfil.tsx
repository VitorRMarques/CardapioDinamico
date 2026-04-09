// ===== IMPORTAÇÕES =====
// Importa hooks do React (useEffect, useState)
import { useEffect, useState } from "react";
// Importa hook do contexto global de cliente
import { useClienteStore } from "./context/ClienteContext";
// Importa hook de navegação
import { useNavigate } from "react-router-dom";
// Importa tipo ProdutoType para tipagem
import type { ProdutoType } from "./util/ProdutoType";

// ===== CONFIGURAÇÃO DA API =====
// Obtém URL da API das variáveis de ambiente ou usa localhost como padrão
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ===== TIPOS =====
// Define formato de um pedido
type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
}

// ===== COMPONENTE: PERFIL =====
// Página de perfil - exibe histórico de pedidos do cliente
export default function Perfil() {
    // Hook do Zustand para obter dados do cliente autenticado
    const { cliente } = useClienteStore();
    // Hook para navegar para outras páginas
    const navigate = useNavigate();
    // Estado para armazenar lista de pedidos do cliente
    const [pedidos, setPedidos] = useState<PedidoType[]>([]);

    // ===== EFFECT: BUSCA PEDIDOS DO CLIENTE =====
    useEffect(() => {
        // Verifica se cliente está autenticado
        if (!cliente.email) {
            // Se não, redireciona para login
            navigate('/login');
            return;
        }

        // Função assíncrona para buscar pedidos do cliente
        async function buscaPedidos() {
            // Verifica se cliente tem token de autenticação
            if (!cliente.token) {
                console.error('Token não encontrado')
                return
            }

            try {
                // Faz requisição GET para obter pedidos do cliente
                const response = await fetch(`${apiUrl}/pedidos`, {
                    headers: {
                        // Envia token JWT no cabeçalho Authorization
                        'Authorization': `Bearer ${cliente.token}`
                    }
                });
                
                // Se requisição foi bem-sucedida
                if (response.ok) {
                    const dados = await response.json();
                    // Atualiza estado com pedidos obtidos
                    setPedidos(dados);
                } else if (response.status === 401) {
                    // Se token expirou ou é inválido
                    console.warn('Token inválido ou expirado. Redirecionando para login.');
                    navigate('/login');
                } else {
                    // Se houver outro erro
                    const errorBody = await response.text();
                    console.error('Erro ao buscar pedidos:', response.status, errorBody);
                }
            } catch (error) {
                // Se houver erro de conexão
                console.error('Erro de conexão', error);
            }
        }
        // Chama função de busca
        buscaPedidos();
    }, [cliente, navigate]);

    async function excluirPedido(pedidoId: number){
            if (!cliente.token) return

            console.log('Tentando excluir pedido:', `${apiUrl}/pedidos/${pedidoId}`)

            try {
                const response = await fetch(`${apiUrl}/pedidos/${pedidoId}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cliente.token}`
                }
            })

            if (response.ok) {
                setPedidos(prev => prev.filter(p => p.id !== pedidoId))
            } else if (response.status === 401) {
                navigate('/login')
            } else {
                console.error('Erro ao excluir pedido:', response.status )
            }
            } catch (error) {
                console.error('Erro de conexao', error)
            }


        }

    // ===== RENDER =====
    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-950 rounded-2xl shadow-2xl">
            {/* Título da página */}
            <h1 className="text-4xl font-extrabold mb-8 text-center text-white tracking-tight">Meus pedidos</h1>
            
            {/* Se não há pedidos, exibe mensagem */}
            {pedidos.length === 0 ? (
                <p className="text-2xl font-bold text-red-500">Você ainda não fez nenhum pedido.</p>
            ) : (
                // Se há pedidos, exibe lista
                <div className="space-y-6">
                    {/* Mapeia cada pedido em um card */}
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex gap-5 items-start shadow-md hover:shadow-orange-500/20 hover:border-orange-500 transition-all duration-300">

                            {/* Foto do produto */}
                            <img className="w-28 h-28 object-cover rounded-xl flex-shrink-0" src={pedido.produto.foto} alt={pedido.produto.descricao} />
                            {/*Informacoes do produto*/}

                            <div className="flex-1 text-left">
                                {/* Descrição do produto */}
                            <h2 className="text-xl font-bold text-white mb-1">{pedido.produto.descricao}</h2>

                            {/* Nome do restaurante */}
                            <p className="text-gray-400 text-2xl font-bold mb-1"><span className="text-gray-300">Restaurante:</span> {pedido.produto.restaurante.nome}</p>
                            
                            {/* Preço do produto */}
                            <p className="text-orange-400 font-bold text-lg mb-1"><span className="font-bold">Preço:</span> R$ {Number(pedido.produto.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}</p>
                            
                            {/* Data de criação do pedido */}
                            <p className="text-gray-500"><span className="font-bold">Data:</span> {new Date(pedido.createdAt).toLocaleString("pt-br")}</p>
                            
                            {/* Data estimada de preparo (data + tempo de preparo) */}
                            <p className="text-gray-500 mb-4"><span className="font-bold">Na bancada:</span> {new Date(pedido.createdAt).toLocaleString("pt-br") + (pedido.produto.tempoPreparo ? ` + (${pedido.produto.tempoPreparo} minutos)` : '')}</p>

                                <button 
                                onClick={() => {
                                    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
                                        excluirPedido(pedido.id);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Excluir
                            </button>

                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}