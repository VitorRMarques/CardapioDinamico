// ===== IMPORTAÇÕES =====
// Importa hook para gerenciar formulários
import { useForm } from "react-hook-form";
// Importa hooks para navegação e links de roteamento
import { useNavigate, Link } from "react-router-dom";
// Importa sistema de notificações
import { toast } from "sonner";
// Importa hook do contexto global de cliente
import {useClienteStore} from "./context/ClienteContext"

// ===== TIPOS =====
// Define formato dos dados do formulário de login
type Inputs = {
    email: string      // Email do cliente
    senha: string      // Senha do cliente
    manter: boolean    // Opção para manter conectado
}

// ===== CONFIGURAÇÃO DA API =====
// Obtém URL da API das variáveis de ambiente
const apiUrl = import.meta.env.VITE_API_URL

// ===== COMPONENTE: LOGIN =====
// Página de login - autentica usuário e cria token JWT
export default function Login() {
    // Hook do react-hook-form para gerenciar formulário
    const { register, handleSubmit } = useForm<Inputs>()
    // Hook do Zustand para fazer login do cliente
    const { logaCliente } = useClienteStore()
    // Hook para navegar para outras páginas
    const navigate = useNavigate()

    // ===== FUNÇÃO: VERIFICA LOGIN =====
    // Valida credenciais e faz login se corretas
    async function verificaLogin(data: Inputs) {
        // Faz requisição POST para endpoint de login
        const response = await
          fetch(`${apiUrl}/clientes/login`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({ email: data.email, senha: data.senha })
          })

        // Se login bem-sucedido (código 200)
        if (response.status == 200) {
            // Obtém dados do cliente e token JWT
            const dados = await response.json()
            // Faz login no estado global (Zustand)
            logaCliente(dados)

            // Se usuário marcou "manter conectado"
            if (data.manter) {
                // Salva dados no localStorage para persistência
                localStorage.setItem("clienteKey", JSON.stringify(dados))
            } else {
                // Caso contrário, remove dados salvos anteriormente
                if (localStorage.getItem("clienteKey")) {
                    localStorage.removeItem("clienteKey")
                }
            }

            // Redireciona para página inicial
            navigate("/")
        } else {
            // Exibe toast de erro se login falhou
            toast.error("Login ou senha incorretos.")
        }
    
    }

    // ===== RENDER =====
    return (
        <section className="bg-gray-50 dark:bg-black">
            {/* Espaço de preenchimento */}
            <p style={{height: 48}}></p>
            
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                {/* Container do formulário */}
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {/* Título */}
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Dados de acesso do cliente
                        </h1>
                        
                        {/* Formulário de Login */}
                        <form className="space-y-4 md:space-y-6"
                              onSubmit={handleSubmit(verificaLogin)}>
                            
                            {/* Campo Email */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                                <input type="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border_blue-500
                                        "required 
                                         {...register("email")} />
                            </div>
                            
                            {/* Campo Senha */}
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha de acesso</label>
                                <input type="password" id="senha"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        "required 
                                         {...register("senha")} />
                            </div>
                            
                            {/* Checkbox Manter Conectado */}
                            <div>
                                <div>
                                    <div>
                                        <input id="remember" type="checkbox" aria-describedby="remember"
                                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                               {...register("manter")} />
                                    </div>
                                    <div>
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Manter concectado</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu a senha?</a>
                            </div>
                            
                            {/* Botão Enviar */}
                            <button type="submit" className="w-full text-white bg-gray-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus-ring-blue-800">
                                Entrar
                            </button>
                            
                            {/* Link para cadastro */}
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Ainda não tem uma conta? <Link to="/cadastro" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Cadastre-se</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

        </section>
    )
}