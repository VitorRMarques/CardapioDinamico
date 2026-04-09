// ===== IMPORTAÇÕES =====
// Importa hook de navegação
import { useNavigate } from "react-router-dom"
// Importa tipo ProdutoType para tipagem
import type { ProdutoType } from "../util/ProdutoType";
// Importa hook do contexto global de cliente
import { useClienteStore } from "../context/ClienteContext";

// ===== COMPONENTE: CARD PRODUTO =====
// Componente que exibe um produto em formato de card
// Props: data - objeto do tipo ProdutoType com informações do produto
export function CardProduto({data}: {readonly data: ProdutoType}){
    // Hook para navegar para outras páginas
    const navigate = useNavigate();
    // Hook do Zustand para obter dados do cliente autenticado
    const { cliente } = useClienteStore();

    // ===== FUNÇÃO: HANDLE VER DETALHES =====
    // Navega para página de detalhes do produto ou redireciona para login
    const handleVerDetalhes = () => {
        // Se cliente está autenticado, vai para detalhes
        if (cliente.email) {
            navigate(`/detalhes/${data.id}`);
        } else {
            // Caso contrário, vai para login
            navigate('/login');
        }
    };

    // ===== RENDER =====
    return (
        <div className="p-2 max-w-sm bg-white border border-gray-200 shadow-sm dark:bg-black dark:border-gray-700 h-full flex flex-col">
            {/* Nome do restaurante */}
            <h5 className="mb-2 text-5xl font-bold tracking-tight text-sky-200">
                    {data.restaurante.nome} 
            </h5>
            
            {/* Imagem do produto */}
            <img className="rounded-t-lg w-full h-48 object-cover" src={data.foto} alt="Foto" />
            
            {/* Informações do produto */}
            <div className="p-10">
                
                {/* Descrição do produto */}
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                    {data.descricao} 
                </h5>
                
                {/* Preço formatado em Real brasileiro */}
                <p className="mb-3 font-extrabold text-gray-700 dark:text-gray-400">
                    preco R$: {Number(data.preco).toLocaleString("pt-br", {
                        minimumFractionDigits: 2
                    })}
                </p>
                
                {/* Nome do restaurante */}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    restaurante: {data.restaurante.nome}
                </p>
                
                {/* Ingredientes do produto */}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    ingredientes: {data.ingredientes}
                </p>
                
                {/* Tipo do produto */}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    tipo: {data.Tipo}
                </p>
                
                {/* Tempo de preparo em minutos */}
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    tempo de preparo: {`${data.tempoPreparo} minutos`}
                </p>
                
                {/* Botão para ver detalhes e fazer pedido */}
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