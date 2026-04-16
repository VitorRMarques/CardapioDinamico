// ===== IMPORTAÇÕES =====
// Importa hook para navegação e links
import { Link } from "react-router-dom"
// Importa hook do contexto global de cliente
import { useClienteStore } from "../context/ClienteContext"
// Importa imagem do logo do restaurante
import restauranteLogo from "../assets/restauranteLogo.png"

// ===== COMPONENTE: TITULO =====
// Componente de cabeçalho/navbar da aplicação
// Exibe logo, nome, e opções de login/perfil/logout
export default function Titulo(){
    // Hook do Zustand para obter dados do cliente e função de logout
    const { cliente, deslogaCliente } = useClienteStore()

    // ===== FUNÇÃO: HANDLE LOGOUT =====
    // Faz logout do cliente removendo dados do état global e localStorage
    const handleLogout = () => {
        // Remove dados do cliente do estado global (Zustand)
        deslogaCliente()
        // Remove dados salvos no localStorage
        localStorage.removeItem("clienteKey")
    }

    // ===== FUNÇÃO: MEU ESTILO =====
    // Retorna estilo CSS para a imagem do logo
    const meuEstilo = () => {
        const estiloImg = {
            backgroundImage: `url(${restauranteLogo})`, // Define imagem como fundo
            backgroundSize: 'cover',                     // Cobre todo o espaço
            height: '200px',                            // Altura em pixels
            width: '200px',                             // Largura em pixels
        }
        return estiloImg
    }

    // ===== RENDER =====
    return (
        <nav className="border-orange-500 bg-orange-400 dark:border-orange-700">
            <div className="max-w flex flex-wrap items-center justify-between mx-auto p-10">
                
                {/* Logo e nome da aplicação */}
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {/* Imagem do logo */}
                    <img src={restauranteLogo} className="h-12" style={meuEstilo()} alt="logo restaurante" />
                    
                    {/* Nome da aplicação */}
                    <span className="underline-offset-3 decoration-3 decoration-yellow-400 underline self-center px-7 text-5xl font-bold whitespace-nowrap dark:text-white">
                        Cardapio Dinamico
                    </span>
                </Link>
                
                {/* Botão menu mobile (hamburger) */}
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus-ring-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"></path>
                    </svg>
                </button>
                
                {/* Menu de navegação (login/perfil/logout) */}
                <div>
                    <ul>
                        <li>
                            {/* Se cliente está autenticado, exibe saudação e opções de perfil/logout */}
                            {cliente.id ? (
                                <div className="flex items-center space-x-4">
                                    {/* Saudação personalizada */}
                                    <span className="text-white font-semibold">Olá, {cliente.nome}</span>
                                    
                                    {/* Link para página de perfil */}
                                    <Link to="/perfil" className="text-white hover:text-gray-700 font-semibold border p-2">Perfil</Link>
                                    
                                    {/* Link para adicionar produto */}
                                    {cliente.role === "ADMIN" && (
                                        <Link to="/cadastro-produto" className="text-white hover:text-gray-500 font-semibold border p-2">Adicionar Produto</Link>
                                    )}
                                    
                                    {/* Botão de logout */}
                                    <button onClick={handleLogout} className="bg-gray-600 block md:p-4 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                // Se não autenticado, exibe link para login
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="bg-gray-600  block md:p-4 text-gray-900 rounded-sm hover:bg-gray-200 transition md:hover:bg-transparent md:border-0 md:hover:text-gray-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                                        Identifique-se
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

