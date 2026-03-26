import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

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
                localStorage.setItem("clienteKey", dados.id)
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
                                        <input type="text" />
                                    </div>
                                    <div>
                                        <label htmlFor=""></label>
                                    </div>
                                </div>
                            </div>
                            <button>
                                Entrar
                            </button>
                            <p>
                                Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

        </section>
    )
}