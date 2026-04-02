import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa";
import type { ProdutoType } from "./util/ProdutoType"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function App() {
    const [produtos, setProdutos] = useState<ProdutoType[]>([])

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/produtos`)
            const dados = await response.json()

            setProdutos(dados)
        }
        buscaDados()
    }, [])

    const listaProdutos = produtos.map( produto => (
        <CardProduto data={produto} key={produto.id} />
    ))
    const estiloFundo = () => {
        const fundo = {
            backgroundColor: "black",
        }
        return fundo
    }



    return (
        <div style={estiloFundo()}>
          <InputPesquisa setProdutos={setProdutos} />
          <div className=" max-w-7xl mx-auto">
            <h1 className="bg-blue-100 rounded-1xl m-40 mx-2 mt-0 mb-20  p-15 px-1 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Bem-vindo ao <span className="underline underline-offset-3 decoration-8 decoration-purple-100  dark:decoration-purple-500">CardápioDinâmico</span>
                <br />
                <span className="text-2xl font-light leading-tight text-gray-900 dark:black">
                    Faça seu pedido
                </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {listaProdutos}
            </div>
          </div>
        </div>
    )
}