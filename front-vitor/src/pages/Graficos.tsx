import { useEffect, useState } from 'react'
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTooltip, VictoryPie, VictoryLabel} from 'victory'
import { useClienteStore } from '../context/ClienteContext'
import { useNavigate } from 'react-router-dom'


const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type Pedido = {
    id: number
    clienteId: string
    produtoId: number
    createdAt: string
    cliente: { id: string, nome: string, email: string}
    produto: {
        id: number
        descricao: string
        preco: number
        foto: string
        Tipo: string
        tempoPreparo: number
        restaurante: { nome: string }
    }
    observacao?: string
    status: 'PENDENTE' | 'PRONTO' | 'ENTREGUE'
}
type ClientePedidosData = {
    x: string
    y: number
}
type ProdutoFrequenciaData = {
    x: string
    y: number
}

export default function Graficos() {
    const { cliente } = useClienteStore()
    const navigate = useNavigate()
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [clientePedidosData, setClientePedidosData] = useState<ClientePedidosData[]>([])
    const [produtoFrequenciaData, setProdutoFrequenciaData] = useState<ProdutoFrequenciaData[]>([])
    const [carregando, setCarregando] = useState(true)
    useEffect(() => {
        if (cliente.role !== 'ADMIN') {
            navigate('/')
            return
        }

        async function buscaDados() {
            try {
                const response = await fetch(`${apiUrl}/pedidos/admin`, {
                    headers: {'Authorization': `Bearer ${cliente.token}`}
                })

                if (response.ok) {
                    const todosPedidos = await response.json()
                    setPedidos(todosPedidos)
                    processarDados(todosPedidos)
                } else if (response.status === 401) {
                    navigate('/login')
                } else {
                    const error = await response.json()
                    console.error('Erro ao buscar pedidos:', error)
                }
            } catch(error) {
            console.error('Erro de conexao', error)
        } finally {
            setCarregando(false)
        }
    }
    buscaDados()
    }, [cliente, navigate])

    const processarDados = (todosPedidos: Pedido[]) => {
        const clientePedidos: Record<string, number> ={}
        todosPedidos.forEach((pedido) => {
            const nomeCliente = pedido.cliente.nome
            clientePedidos[nomeCliente] = (clientePedidos[nomeCliente] || 0) + 1
        })

        const clienteData: ClientePedidosData[] = Object.entries(clientePedidos)
            .map(([nome, quantidade]) => ({
            x: nome.length > 15 ? nome.substring(0, 15) + '...': nome,
            y: quantidade
        }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 10)

        setClientePedidosData(clienteData)

        const produtoFrequencia: Record<string, number> = {}
        todosPedidos.forEach((pedido) => {
            const descricaoProduto = pedido.produto.descricao
            produtoFrequencia[descricaoProduto] = (produtoFrequencia[descricaoProduto] || 0) + 1
        })
        const produtoData: ProdutoFrequenciaData[] = Object.entries(produtoFrequencia)
            .map(([descricao, quantidade]) => ({
                x: descricao.length > 20 ? descricao.substring(0, 20) + '...': descricao,
                y: quantidade
            }))
            .sort((a, b) => b.y - a.y)
            .slice(0, 8)
        setProdutoFrequenciaData(produtoData)
    }
    if (carregando) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black'>
                <p className='text-gray-500'>Carregando Graficos...</p>
            </div>
        )
    }
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black'>
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
                <div className='max-w-7xl mx-auto px-6 py-12 text-center'>
                    <p className='text-sm font-medium tracking-widest text-purple-600 uppercase mb-3'>
                        Analise de Dados
                    </p>
                    <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2'>
                        Grafico de Pedidos

                    </h1>
                    <p className='text-lg text-gray-500 dark:text-gray-400'>
                        visualize a relacao entre clientes, produtos e pedidos
                    </p>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <p className='text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                            total de pedidos
                        </p>
                        <p className='text-4xl font-bold text-gray-900 dark:text-white mt-2'>
                            {pedidos.length}
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <p className='text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                            Clientes Unicos
                        </p>
                        <p className=' text-4xl font-bold text-gray-900 dark:text-white mt-2'>
                            {new Set(pedidos.map(p => p.cliente.id)).size}
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <p className='text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                            Produtos Unicos
                        </p>
                        <p className='text-4xl font-bold text-gray-900 dark:text-white mt-2'>
                            {new Set(pedidos.map(p => p.produto.id)).size}
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                            Quantidade de Pedidos por cliente (top 10)
                        </h2>
                        <div className='flex justify-center overflow-x-auto'>
                            <VictoryChart
                                domainPadding={{x: 40, y: 20}}
                                width={700}
                                height={350}
                                theme={{
                                    axis:{
                                        style:{
                                            tickLabels: {fill: '#666'}
                                        }
                                    }
                                }}
                            >
                                <VictoryAxis
                                    label="Clientes"
                                    style={{
                                        axisLabel: { fontSize: 12},
                                        tickLabels: { fontSize: 10, angle: 0}
                                    }}
                                />
                                <VictoryAxis
                                    dependentAxis
                                    label="Quantidade de Pedidos"
                                    style={{
                                        axisLabel: { fontSize: 12}
                                    }}
                                />
                                <VictoryBar
                                    data={clientePedidosData}
                                    style={{
                                        data: {
                                            fill: '#8b5cf6'
                                        }
                                    }}
                                    labelComponent={<VictoryTooltip/>}
                                />
                            </VictoryChart>
                        </div>
                    </div>
                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                            Produtos mais Solicitados (top 8)
                        </h2>
                        <VictoryChart
                            domainPadding={{x: 40, y: 20}}
                            width={700}
                            height={350}
                        >
                            <VictoryAxis
                                label="Produtos"
                                style={{
                                    axisLabel: {fontSize: 12 },
                                    tickLabels: {fontSize: 10, angle: 0}
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                label="Numero de Pedidos"
                                style={{
                                    axisLabel: { fontSize: 12 }
                                }}
                            />
                            <VictoryBar
                                data={produtoFrequenciaData}
                                style={{
                                    data: {
                                        fill: "#10b981"
                                    }
                                }}
                                labelComponent={<VictoryTooltip/>}
                            />
                        </VictoryChart>
                    </div>

                    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                            Distribuicao de Tipos de Produtos
                        </h2>
                        <div className='flex justify-center'>
                            <VictoryPie
                                data={
                                    Object.entries(
                                        pedidos.reduce((acc: Record<string, number>, pedido) => {
                                            acc[pedido.produto.Tipo] = (acc[pedido.produto.Tipo] || 0) + 1
                                            return acc
                                        }, {})

                                    ).map(([tipo, quantidade]) => ({
                                        x: tipo,
                                        y: quantidade
                                    }))
                                }
                                width={400}
                                height={300}
                                colorScale={['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']}
                                labels={({ datum }) => `${datum.x}: ${datum.y}`}
                                labelComponent={<VictoryLabel angle={0} />}
                                style={{
                                    data: {
                                        stroke: '#fff',
                                        strokeWidth: 2
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )



}