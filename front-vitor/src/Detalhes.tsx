import type { ProdutoType } from "./util/ProdutoType";
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type PedidoType = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    produto: ProdutoType
    cliente: { id: string, nome: string, email: string }
}

export default function Detalhes() {
    const params = useParams()
    const navigate = useNavigate();

    const [produto, setProduto] = useState<ProdutoType>()
    const [pedido, setPedido] = useState<PedidoType>()
    const { cliente } = useClienteStore()

    useEffect(() => {
        if (!cliente.email) {
            navigate('/login');
            return;
        }

        async function buscaDados() {
            const response = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
            const dados = await response.json()

            setProduto(dados)
        }
        buscaDados()
    }, [params.produtoId, cliente.email, navigate])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const adicional = formData.get('adicional') as string

        console.log('Iniciando handleSubmit')
        console.log('params.produtoId:', params.produtoId)
        console.log('cliente.token:', cliente.token ? 'presente' : 'ausente')
        console.log('adicional:', adicional)

        try {
            if (!cliente.token) {
                toast.error('Token de autenticação não encontrado. Faça login novamente.')
                navigate('/login')
                return
            }

            const body = {
                produtoId: parseInt(params.produtoId!)
            }
            console.log('Body a enviar:', body)

            const response = await fetch(`${apiUrl}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cliente.token}`
                },
                body: JSON.stringify(body)
            })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)

            if (response.ok) {
                const dados = await response.json()
                setPedido(dados)
                toast.success('Pedido realizado com sucesso!')
                navigate('/perfil')
            } else {
                const error = await response.json()
                console.error('Erro na resposta:', error)
                toast.error(error.erro || error.message || 'Erro ao realizar pedido')
            }
        } catch (error) {
            console.error('Erro de conexão:', error)
            toast.error('Erro de conexão')
        }
    }

    return (
        <div>
            <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounde-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img src={produto?.foto} alt="" className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"/>
                <div className="flex flex-col justify-between p-4 leading-normal"> 
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {produto?.restaurante.nome} {produto?.descricao}
                    </h5>
                    <h5>
                        Descricao: {produto?.descricao} - {produto?.status}

                    </h5>
                    <h5>
                        Preco R$: {Number(produto?.preco).toLocaleString("pt-br", {minimumFractionDigits: 2})}
                    </h5>
                    <p>
                    {produto?.ingredientes}
                    </p>
                    {produto?.id ?
            <>
            <br />
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                🙂Você pode fazer um pedido!</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${cliente.nome} (${cliente.email})`} disabled readOnly />
                <textarea name="adicional" id="message" className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Descreva algum adicional ou remocao de ingredientes"
                  ></textarea>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Solicitar pedido ao restaurante {produto.restaurante.nome} </button>
              </form>
            </>
            :
            <h2 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              😎Gostou? Identifique-se e faça uma Proposta!
            </h2>
          }
                </div>
            </section>
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