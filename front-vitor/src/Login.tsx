import { useForm } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";

import { toast } from "sonner";

import {useClienteStore} from "./context/ClienteContext"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()
    const { logaCliente } = useClienteStore()

    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        const response = await
          fetch(`${apiUrl}/clientes/login`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({ email: data.email, senha: data.senha })
          })

        if (response.status == 200) {

            const dados = await response.json()

            logaCliente(dados)

            if (data.manter) {
                localStorage.setItem("clienteKey", JSON.stringify(dados))
            } else {
                if (localStorage.getItem("clienteKey")) {
                    localStorage.removeItem("clienteKey")
                }
            }

            navigate("/")
        } else {
            toast.error("Login ou senha incorretos.")
        }
    
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <p style={{height: 48}}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Dados de acesso do cliente

                        </h1>
                        <form className="space-y-4 md:space-y-6"
                              onSubmit={handleSubmit(verificaLogin)}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                                <input type="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border_blue-500
                                        "required 
                                         {...register("email")} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha de acesso</label>
                                <input type="password" id="password"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border_blue-500
                                        "required 
                                         {...register("senha")} />
                            </div>
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
                                <a href="submit" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu a senha?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-gray-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focues-ring-blue-800">
                                Entrar
                            </button>
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