// ===== IMPORTAÇÕES =====
// Importa componente CardProduto for exibir cada produto
import { CardProduto } from "./components/CardProduto"
// Importa componente de busca/pesquisa de produtos
import { InputPesquisa } from "./components/InputPesquisa";
// Importa tipo ProdutoType para tipagem
import type { ProdutoType } from "./util/ProdutoType"
// Importa hooks do React (useEffect, useState)
import { useEffect, useState } from "react";

// ===== CONFIGURAÇÃO DA API =====
// Obtém URL da API das variáveis de ambiente ou usa localhost como padrão
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ===== COMPONENTE: APP (PÁGINA INICIAL) =====
// Componente principal que exibe lista de produtos
export default function App() {
    // Estado para armazenar lista de produtos
    const [produtos, setProdutos] = useState<ProdutoType[]>([])

    // Effect para buscar produtos ao carregar o componente
    useEffect(() => {
        // Função assíncrona para buscar dados da API
        async function buscaDados() {
            // Faz requisição GET para obter todos os produtos
            const response = await fetch(`${apiUrl}/produtos`)
            // Converte resposta em JSON
            const dados = await response.json()
            // Atualiza estado com produtos obtidos
            setProdutos(dados)
        }
        // Chama função de busca
        buscaDados()
    }, []) // Array vazio = executa apenas uma vez ao montar

    // ===== RENDERIZAÇÃO DE PRODUTOS =====
    // Mapeia array de produtos em array de componentes CardProduto
    const listaProdutos = produtos.map( produto => (
        <CardProduto data={produto} key={produto.id} />
    ))

    // ===== ESTILO DO FUNDO =====
    // Função que retorna estilo de fundo preto
    const estiloFundo = () => {
        const fundo = {
            backgroundColor: "black",
        }
        return fundo
    }

    // ===== RENDER =====
    return (
        <div style={estiloFundo()}>
          {/* Componente de pesquisa com prop para atualizar lista de produtos */}
          <InputPesquisa setProdutos={setProdutos} />
          
          <div className=" max-w-7xl mx-auto text-center">
            {/* Cabeçalho com título e subtítulo */}
            <h1 className=" bg-blue-100 rounded-1xl m-40 mx-2 mt-0 mb-20  p-15 px-1 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Bem-vindo ao <span className="underline underline-offset-3 decoration-8 decoration-purple-100  dark:decoration-purple-500">CardápioDinâmico</span>
                <br />
                <span className="text-3xl px-4 font-light leading-tight text-gray-900 dark:black">
                    Faça seu pedido
                </span>
            </h1>
            
            {/* Grid responsivo para exibir cards de produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {listaProdutos}
            </div>
          </div>
        </div>
    )
}