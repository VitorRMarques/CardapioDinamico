import { useNavigate } from "react-router-dom"
import type { ProdutoType } from "../util/ProdutoType";
import { useClienteStore } from "../context/ClienteContext";


export function CardProduto({data}: {readonly data: ProdutoType}){
    const navigate = useNavigate();
    const { cliente } = useClienteStore();

    const handleVerDetalhes = () => {
        if (cliente.email) {
            navigate(`/detalhes/${data.id}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="p-2 max-w-sm bg-white border border-gray-200 shadow-sm dark:bg-black dark:border-gray-700 h-full flex flex-col">
            <h5 className="mb-2 text-5xl font-bold tracking-tight text-sky-200">
                    {data.restaurante.nome} 
            </h5>
            <img className="rounded-t-lg w-full h-48 object-cover" src={data.foto} alt="Foto" />
            <div className="p-10">
                
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {data.descricao} 
                </h5>
                <p className="mb-3 font-extrabold text-gray-700 dark:text-gray-400">
                    preco R$: {Number(data.preco).toLocaleString("pt-br", {
                        minimumFractionDigits: 2
                    })}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    restaurante: {data.restaurante.nome}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    ingredientes: {data.ingredientes}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    tipo: {data.Tipo}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    tempo de preparo: {`${data.tempoPreparo} minutos`}
                </p>
                <button onClick={handleVerDetalhes} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-100 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-yellow-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Ver Detalhes
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}