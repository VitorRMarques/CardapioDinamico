import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useClienteStore } from "./context/ClienteContext";

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
    const { logaCliente } = useClienteStore()
    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        const response = await fetch(`${apiUrl}/clientes/login`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ email: data.email, senha: data.senha })
        })

        if (response.status === 200) {
            const dados = await response.json()
            logaCliente(dados)

            if (data.manter) {
                localStorage.setItem("clienteKey", JSON.stringify(dados))
            } else {
                localStorage.removeItem("clienteKey")
            }

            if (!data.manter) {
                localStorage.removeItem("clienteKey")
            }

            navigate("/")
        } else {
            toast.error("Login ou senha incorretos.")
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-black min-h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">

                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 sm:p-8 space-y-6">

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Dados de acesso do cliente
                        </h1>

                        <form className="space-y-5" onSubmit={handleSubmit(verificaLogin)}>

                            {/* Campo Email */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Seu email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu@email.com"
                                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white
                                        ${errors.email
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600"
                                        }`}
                                    {...register("email", {
                                        required: "O e-mail é obrigatório.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Informe um e-mail válido."
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <span>⚠</span> {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Campo Senha */}
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Senha de acesso
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    placeholder="••••••••"
                                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white
                                        ${errors.senha
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600"
                                        }`}
                                    {...register("senha", {
                                        required: "A senha é obrigatória.",
                                        minLength: {
                                            value: 6,
                                            message: "A senha deve ter no mínimo 6 caracteres."
                                        }
                                    })}
                                />
                                {errors.senha && (
                                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <span>⚠</span> {errors.senha.message}
                                    </p>
                                )}
                            </div>

                            {/* Checkbox + Esqueceu a senha */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        {...register("manter")}
                                    />
                                    <span className="text-sm text-gray-500 dark:text-gray-300">Manter conectado</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            {/* Botão Enviar */}
                            <button
                                type="submit"
                                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors"
                            >
                                Entrar
                            </button>

                            {/* Link para cadastro */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                Ainda não tem uma conta?{" "}
                                <Link to="/cadastro" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                    Cadastre-se
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}