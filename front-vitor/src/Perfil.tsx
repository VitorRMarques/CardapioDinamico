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
        <div className="max-w-4xl mx-auto mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow">
            {/* Título da página */}
            <h1 className="text-5xl font-bold mb-6 px-60">Meus pedidos</h1>
            
            {/* Se não há pedidos, exibe mensagem */}
            {pedidos.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                // Se há pedidos, exibe lista
                <div className="space-y-4">
                    {/* Mapeia cada pedido em um card */}
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="border border-gray-300 rounded-lg p-4">
                            {/* Descrição do produto */}
                            <h2 className="text-xl font-semibold">{pedido.produto.descricao}</h2>
                            
                            {/* Nome do restaurante */}
                            <p>Restaurante: {pedido.produto.restaurante.nome}</p>
                            
                            {/* Preço do produto */}
                            <p>Preço: R$ {Number(pedido.produto.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}</p>
                            
                            {/* Data de criação do pedido */}
                            <p>Data: {new Date(pedido.createdAt).toLocaleString("pt-br")}</p>
                            
                            {/* Data estimada de preparo (data + tempo de preparo) */}
                            <p>Na bancada: {new Date(pedido.createdAt).toLocaleString("pt-br") + (pedido.produto.tempoPreparo ? ` + (${pedido.produto.tempoPreparo} minutos)` : '')}</p>

                                <button 
                                onClick={() => {
                                    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
                                        excluirPedido(pedido.id);
                                    }
                                }}
                                style={{ 
                                    backgroundColor: '#ef4444', 
                                    color: 'white', 
                                    fontWeight: 'bold', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px',
                                    marginTop: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}