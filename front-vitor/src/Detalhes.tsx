// ===== IMPORTAÇÕES =====
// Importa tipo ProdutoType para tipagem
import type { ProdutoType } from "./util/ProdutoType";
// Importa hooks para navegação e parâmetros de rota
import { useParams, useNavigate } from "react-router-dom"
// Importa hooks do React (useEffect, useState)
import { useEffect, useState } from "react";
// Importa hook do contexto global de cliente
import { useClienteStore } from "./context/ClienteContext";
// Importa sistema de notificações
import { toast } from "sonner";

// ===== CONFIGURAÇÃO DA API =====
// Obtém URL da API das variáveis de ambiente ou usa localhost como padrão
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ===== TIPOS =====
// Define formato de um pedido com todas suas informações
type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
    cliente: { id: string, nome: string, email: string }
}

// ===== COMPONENTE: DETALHES =====
// Página de detalhes do produto - permite fazer pedidos
export default function Detalhes() {
    // Hook para obter parâmetros da URL (produtoId)
    const params = useParams()
    // Hook para navegar para outras páginas
    const navigate = useNavigate();

    // Estado para armazenar dados do produto
    const [produto, setProduto] = useState<ProdutoType>()
    // Estado para armazenar dados do pedido criado
    const [pedido, setPedido] = useState<PedidoType>()
    // Hook do Zustand para obter dados do cliente autenticado
    const { cliente } = useClienteStore()

    // ===== EFFECT: BUSCA DADOS DO PRODUTO =====
    useEffect(() => {
        // Verifica se cliente está autenticado
        if (!cliente.email) {
            // Se não, redireciona para login
            navigate('/login');
            return;
        }

        // Função assíncrona para buscar dados do produto
        async function buscaDados() {
            // Faz requisição GET para obter produto pelo ID
            const response = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
            const dados = await response.json()
            // Atualiza estado com dados do produto
            setProduto(dados)
        }
        // Chama função de busca
        buscaDados()
    }, [params.produtoId, cliente.email, navigate])

    // ===== FUNÇÃO: SUBMETER PEDIDO =====
    // Cria novo pedido quando formulário é submetido
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Previne comportamento padrão do formulário
        e.preventDefault()
        // Obtém dados do formulário
        const formData = new FormData(e.currentTarget)
        // Obtém campo de adicionais (ingredientes extras ou removidos)
        const adicional = formData.get('adicional') as string

        // Logs para debug
        console.log('Iniciando handleSubmit')
        console.log('params.produtoId:', params.produtoId)
        console.log('cliente.token:', cliente.token ? 'presente' : 'ausente')
        console.log('adicional:', adicional)

        try {
            // Verifica se cliente tem token de autenticação
            if (!cliente.token) {
                toast.error('Token de autenticação não encontrado. Faça login novamente.')
                navigate('/login')
                return
            }

            // Prepara corpo da requisição com ID do produto
            const body = {
                produtoId: parseInt(params.produtoId!)
            }
            console.log('Body a enviar:', body)

            // Faz requisição POST para criar pedido
            const response = await fetch(`${apiUrl}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Envia token JWT no cabeçalho Authorization
                    'Authorization': `Bearer ${cliente.token}`
                },
                body: JSON.stringify(body)
            })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)

            // Se pedido foi criado com sucesso
            if (response.ok) {
                const dados = await response.json()
                setPedido(dados)
                toast.success('Pedido realizado com sucesso!')
                // Redireciona para perfil para ver pedidos
                navigate('/perfil')
            } else {
                // Se houver erro, exibe mensagem
                const error = await response.json()
                console.error('Erro na resposta:', error)
                toast.error(error.erro || error.message || 'Erro ao realizar pedido')
            }
        } catch (error) {
            // Se houver erro de conexão
            console.error('Erro de conexão:', error)
            toast.error('Erro de conexão')
        }
    }
    const estiloFundo = () => {
        const fundo = {
            backgroundColor: "black",
        }
        return fundo
    }

    // ===== RENDER =====
    return (
        <div style={estiloFundo()}>
            {/* Seção com detalhes do produto */}
            <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounde-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                {/* Imagem do produto */}
                <img src={produto?.foto} alt="" className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"/>
                
                {/* Informações do produto */}
                <div className=" flex flex-col justify-between p-4 leading-normal"> 
                    {/* Nome do restaurante e descrição */}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white">
                        {produto?.restaurante.nome} {produto?.descricao}
                    </h5>
                    
                    {/* Descrição e status */}
                    <h5 className="text-white">
                        Descricao: {produto?.descricao} - {produto?.status}
                    </h5>
                    
                    {/* Preço do produto */}
                    <h5 className="text-purple-300 font-bold">
                        Preco R$: {Number(produto?.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}
                    </h5>
                    
                    {/* Ingredientes */}
                    <p className="text-yellow-100">
                    {produto?.ingredientes}
                    </p>
                    
                    {/* Se produto carregou, exibe formulário de pedido */}
                    {produto?.id ?
            <>
            <br />
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                🙂Você pode fazer um pedido!</h3>
              
              {/* Formulário para criar pedido */}
              <form onSubmit={handleSubmit}>
                {/* Campo com nome e email do cliente (desabilitado) */}
                <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${cliente.nome} (${cliente.email})`} disabled readOnly />
                
                {/* Campo para adicionais/modificações */}
                <textarea name="adicional" id="message" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Descreva algum adicional ou remocao de ingredientes"
                  ></textarea>
                
                {/* Botão para enviar pedido */}
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Solicitar pedido ao restaurante {produto.restaurante.nome} </button>
              </form>
            </>
            :
            // Se produto não carregou, exibe mensagem para fazer login
            <h2 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              😎Gostou? Identifique-se e faça uma Proposta!
            </h2>
          }
                </div>
            </section>
            
            {/* Se pedido foi criado, exibe confirmação */}
            {pedido && (
                <section className="mt-6 mx-auto flex flex-col items-center bg-green-50 border border-green-200 rounded-lg shadow md:max-w-5xl p-4">
                    <h3 className="text-xl font-bold text-green-800">Pedido Realizado com Sucesso!</h3>
                    <p><strong>ID do Pedido:</strong> {pedido.id}</p>
                    <p><strong>Cliente:</strong> {pedido.cliente.nome} ({pedido.cliente.email})</p>
                    <p><strong>Produto:</strong> {pedido.produto.descricao}</p>
                    <p><strong>Preço:</strong> R$ {Number(pedido.produto.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}</p>
                    <p><strong>Data:</strong> {new Date(pedido.createdAt).toLocaleString("pt-br")}</p>
                </section>
            )}
        </div>
    )
}