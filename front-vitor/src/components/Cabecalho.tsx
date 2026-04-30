                                                                                                                                // ===== IMPORTAÇÕES =====
import type { MouseEvent } from "react"
// Importa hook para navegação e links
import { Link, useNavigate } from "react-router-dom"
// Importa hook do contexto global de cliente
import { useClienteStore } from "../context/ClienteContext"
// Importa imagem do logo do restaurante
import restauranteLogo from "../assets/restauranteLogo.png"

// ===== COMPONENTE: TITULO =====
// Componente de cabeçalho/navbar da aplicação
// Exibe logo, nome, e opções de login/perfil/logout
export default function Cabecalho(){
    // Hook do Zustand para obter dados do cliente e função de logout
    const { cliente, deslogaCliente, logaCliente } = useClienteStore()
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

    const handleAdminClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (!cliente.email) {
            alert('Email do administrador não encontrado. Por favor, faça login novamente.')
            return
        }

        const senha = window.prompt('Digite a senha do administrador para acessar a área de administração:')
        if (!senha) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/clientes/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cliente.email, senha })
            })

            if (!response.ok) {
                alert('Senha incorreta. Acesso à administração negado.')
                return
            }

            const dados = await response.json()
            logaCliente(dados)
            localStorage.setItem('clienteKey', JSON.stringify(dados))
            navigate('/admin')
        } catch (error) {
            console.error('Erro ao verificar senha do administrador:', error)
            alert('Erro de conexão ao verificar senha. Tente novamente.')
        }
    }

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
                                    <Link to="/perfil" className="text-white hover:text-gray-700 font-semibold border p-2">Meus pedidos</Link>
                                    
                                    {/* Link para adicionar produto */}
                                    {cliente.role === "ADMIN" && (
                                        <Link to="/cadastro-produto" className="text-white hover:text-gray-500 font-semibold border p-2">Adicionar Produto</Link>
                                    )}

                                    {cliente.role === "ADMIN" && (
                                        <button
                                            type="button"
                                            onClick={handleAdminClick}
                                            className="text-white hover:text-gray-500 font-semibold border p-2"
                                        >
                                            ADMINISTRACAO
                                        </button>
                                    )}

                                    {cliente.role === "ADMIN" && (
                                        <Link to="/graficos" className="text-white hover:text-gray-500 font-semibold border p-2">GRÁFICOS</Link>
                                    )}
                                    
                                    {/* Botão de logout */}
                                    <button onClick={handleLogout} className="mt-auto focus:outline-none focus:ring-blue-500 focus:border-2 border-purple-400 p-3 transition bg-yellow-500 text-purple-600 underline decoration-blue-300 font-bold hover:text-white hover:bg-yellow-600 ">
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                // Se não autenticado, exibe link para login
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="mt-auto focus:outline-none focus:ring-blue-500 focus:border-transparent p-3  transition bg-yellow-500 text-purple-600 underline decoration-blue-300 font-bold hover:text-white focus:ring-2 hover:bg-purple-600 rounded-xl">
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

