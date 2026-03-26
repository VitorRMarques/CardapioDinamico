import type { ProdutoType } from "./util/ProdutoType";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function Detalhes() {
    const params = useParams()

    const [produto, setProduto] = useState<ProdutoType>()

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
            const dados = await response.json()

            setProduto(dados)
        }
        buscaDados()
    }, [params.produtoId])

    return (
        <div>
            <section>
                <img src={produto?.foto} alt="" />
                <div>
                    <h5>
                        {produto?.restaurante.nome} {produto?.descricao}
                    </h5>
                    <h5>

                    </h5>
                    <h5>

                    </h5>
                    <p>

                    </p>
                </div>
            </section>
        </div>
    )
}