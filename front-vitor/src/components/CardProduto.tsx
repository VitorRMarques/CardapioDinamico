import { useNavigate } from "react-router-dom"
import type { ProdutoType } from "../util/ProdutoType";
import { useClienteStore } from "../context/ClienteContext";

export function CardProduto({ data }: { readonly data: ProdutoType }) {
    const navigate = useNavigate();
    const { cliente } = useClienteStore();

    const handleVerDetalhes = () => {
        
        navigate(`/detalhes/${data.id}`);
        
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">

            {/* Imagem */}
            <div className="relative">
                <img
                    className="w-full h-48 object-cover"
                    src={data.foto}
                    alt={data.descricao}
                />
                {/* Badge restaurante sobre a imagem */}
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {data.restaurante.nome}
                </span>
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex flex-col gap-3 flex-1">

                {/* Descrição + preço */}
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">
                        {data.descricao}
                    </h2>
                    <span className="text-base font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                        R$ {Number(data.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Tags: tipo + tempo */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-medium">
                        {data.Tipo}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-0.5 rounded-full">
                        ⏱ {data.tempoPreparo} min
                    </span>
                </div>

                {/* Ingredientes */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {data.ingredientes}
                </p>

                {/* Botão */}
                <button
                    onClick={handleVerDetalhes}
                    className="mt-auto w-full py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Ver detalhes
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>

            </div>
        </div>
    )
}