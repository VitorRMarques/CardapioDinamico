import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa";
import type { ProdutoType } from "./util/ProdutoType"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL

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

    return (
        <> 
          <InputPesquisa setProdutos={setProdutos} />
          <div className="px-10 max-w-7xl mx-auto">
            <h1 className="px-40 m-4 p-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Produtos <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600 ">EM DESTAQUE</span>
            </h1>
            <div className="flex gap-3">
                {listaProdutos}
            </div>
          </div>
        </>
    )
}