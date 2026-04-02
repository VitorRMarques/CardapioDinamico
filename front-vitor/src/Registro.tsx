import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import {toast} from "sonner"

type Inputs = {
    nome: string
    email: string
    senha: string
    confirmarSenha: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
    const { register, handleSubmit } = useForm<Inputs>()
    const navigate = useNavigate()
    
    async function cadastrarCliente(data: Inputs) {
        if (data.senha !== data.confirmarSenha) {
            toast.error("As senhas nao coincidem")
            return
        }

        const response = await fetch(`${apiUrl}/clientes`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                nome: data.nome,
                email: data.email,
                senha: data.senha
            })
        })

        if (response.status === 201) {
            toast.success("Conta criada com sucesso!")
            navigate("/login")
        } else {
            const erro = await response.json()
            toast.error(erro.erro || erro.message || "Erro ao cadastrar")
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <p style={{height: 48}}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Criar conta de cliente
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(cadastrarCliente)}>
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                <input type="text" id="nome"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Seu nome" required 
                                       {...register("nome")} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                                <input type="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="email@exemplo.com" required 
                                       {...register("email")} />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                                <input type="password" id="senha"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="••••••••" required 
                                       {...register("senha")} />
                            </div>
                            <div>
                                <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar senha</label>
                                <input type="password" id="confirmarSenha"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="••••••••" required 
                                       {...register("confirmarSenha")} />
                            </div>
                            <button type="submit" className="w-full text-white bg-gray-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Cadastrar
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Já tem uma conta? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Faça login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}