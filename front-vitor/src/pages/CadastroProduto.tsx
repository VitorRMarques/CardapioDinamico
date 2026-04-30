import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { RestauranteType } from ".././util/RestauranteType"

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const TIPOS_PRODUTO = [
  "SALGADA",
  "DOCE",
  "ALCOOL",
  "REFRI",
  "AGUA",
  "SUCO",
  
] as const

type TipoProduto = (typeof TIPOS_PRODUTO)[number]

type Inputs = {
  descricao: string
  preco: string
  foto: string
  ingredientes: string
  Tipo: TipoProduto
  tempoPreparo: string
  status: boolean
  restauranteId: string
}

export default function CadastroProduto() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      descricao: "",
      preco: "",
      foto: "",
      ingredientes: "",
      Tipo: "SALGADA",
      tempoPreparo: "0",
      status: true,
      restauranteId: "",
    }
  })
  const navigate = useNavigate()
  const [restaurantes, setRestaurantes] = useState<RestauranteType[]>([])

  useEffect(() => {
    async function buscaRestaurantes() {
      try {
        const response = await fetch(`${apiUrl}/restaurantes`)
        const dados = await response.json()
        setRestaurantes(dados)
      } catch (error) {
        console.error("Erro ao carregar restaurantes:", error)
      }
    }

    buscaRestaurantes()
  }, [])

  async function onSubmit(data: Inputs) {
    if (!data.restauranteId) {
      toast.error("Selecione um restaurante para o produto.")
      return
    }

    const body = {
      descricao: data.descricao,
      preco: Number(data.preco),
      foto: data.foto,
      ingredientes: data.ingredientes || null,
      Tipo: data.Tipo,
      tempoPreparo: data.tempoPreparo === "" ? null : Number(data.tempoPreparo),
      status: data.status,
      restauranteId: Number(data.restauranteId),
    }

    try {
      const response = await fetch(`${apiUrl}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success("Produto cadastrado com sucesso!")
        navigate("/")
      } else {
        const error = await response.json()
        toast.error(error.erro || error.message || "Erro ao cadastrar produto")
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error)
      toast.error("Erro de conexão ao cadastrar produto")
    }
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Cadastro de Produto</h1>

        {restaurantes.length === 0 ? (
          <div className="mb-6 text-yellow-700 dark:text-yellow-300">
            Nenhum restaurante disponível. Cadastre um restaurante primeiro no backend ou atualize a página.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Descrição</label>
            <input
              id="descricao"
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              {...register("descricao")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Preço</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                {...register("preco")}
              />
            </div>
            <div>
              <label htmlFor="tempoPreparo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Tempo de preparo (min)</label>
              <input
                id="tempoPreparo"
                type="number"
                min="0"
                className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("tempoPreparo")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">URL da foto</label>
            <input
              id="foto"
              type="url"
              className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              {...register("foto")}
            />
          </div>

          <div>
            <label htmlFor="ingredientes" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Ingredientes</label>
            <textarea
              id="ingredientes"
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Opcional: Exemplo, tomate, queijo"
              {...register("ingredientes")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="Tipo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de produto</label>
              <select
                id="Tipo"
                className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("Tipo")}
              >
                {TIPOS_PRODUTO.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="restauranteId" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Restaurante</label>
              <select
                id="restauranteId"
                className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                {...register("restauranteId")}
              >
                <option value="">Selecione um restaurante</option>
                {restaurantes.map((restaurante) => (
                  <option key={restaurante.id} value={String(restaurante.id)}>{restaurante.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="status"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register("status")}
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-200">Produto ativo</label>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-3 text-white font-semibold hover:bg-blue-800"
          >
            Cadastrar produto
          </button>
        </form>
      </div>
    </section>
  )
}
