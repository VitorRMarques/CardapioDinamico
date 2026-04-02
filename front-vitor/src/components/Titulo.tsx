import { Link } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"

export default function Titulo(){
    const { cliente, deslogaCliente } = useClienteStore()

    const handleLogout = () => {
        deslogaCliente()
        localStorage.removeItem("clienteKey")
    }

    return (
        <nav className="border-orange-500 bg-orange-400 dark:bg-gray-500 dark:border-orange-700">
            <div className="max-w flex flex-wrap items-center justify-between mx-auto p-10">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../assets/pngtree-restaurant-logo-images-design-restaurant-concept-vector-picture-image_10812228.png" className="h-12" alt="logo restaurante" />
                    <span className="underline-offset-3 decoration-3 decoration-yellow-400 underline self-center px-7 text-5xl font-bold whitespace-nowrap dark:text-white">
                        Cardapio Dinamico
                    </span>
                </Link>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus-ring-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="ht tp://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"></path>
                    </svg>
                </button>
                <div>
                    <ul>
                        <li>
                            {cliente.id ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-white font-semibold">Olá, {cliente.nome}</span>
                                    <Link to="/perfil" className="text-white hover:text-gray-200 font-semibold">Perfil</Link>
                                    <button onClick={handleLogout} className="bg-gray-600 block md:p-4 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-gray-600 block md:p-4 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                                    Identifique-se
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

