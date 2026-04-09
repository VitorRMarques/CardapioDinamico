import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const produtoFormSchema = z.object({
    descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
    preco: z.number().positive("Preço deve ser maior que 0"),
    foto: z.string().url("URL da foto inválida"),
    ingredientes: z.string().optional(),
    Tipo: z.enum(["SALGADA", "DOCE", "BEBIDA", "ACOMPANHAMENTO"]),
    tempoPreparo: z.preprocess(
        (value) => value === "" || value === null ? undefined : Number(value),
        z.number().positive().optional(),
    ),
    status: z.boolean(),
    restauranteId: z.number().positive(),
})

type ProdutoFormInputs = z.infer<typeof produtoFormSchema>

const apiUrl = import.meta.env.VITE_API_URL ?? ""

interface ProductFormProps {
    restauranteId: number
    onProductAdded?: () => void
}

export function ProductForm({ restauranteId, onProductAdded }: ProductFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProdutoFormInputs>({
        resolver: zodResolver(produtoFormSchema) as Resolver<ProdutoFormInputs, any>,
        defaultValues: {
            status: true,
            restauranteId,
        }
    })

    const onSubmit: SubmitHandler<ProdutoFormInputs> = async (data) => {
        try {
            const response = await fetch(`${apiUrl}/produtos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const erro = await response.json()
                toast.error(erro.erro?.message || "Erro ao criar produto")
                return
            }

            await response.json()
            toast.success("Produto criado com sucesso!")
            reset()
            onProductAdded?.()
            
        } catch (error) {
            toast.error("Erro na requisição " + (error instanceof Error ? error.message : ""))
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Novo Produto</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <input
                        type="text"
                        {...register("descricao")}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.descricao && <span className="text-red-600 text-sm">{errors.descricao.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("preco", { valueAsNumber: true })}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.preco && <span className="text-red-600 text-sm">{errors.preco.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Foto (URL)</label>
                    <input
                        type="url"
                        {...register("foto")}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.foto && <span className="text-red-600 text-sm">{errors.foto.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
                    <textarea
                        {...register("ingredientes")}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        {...register("Tipo")}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="SALGADA">Salgada</option>
                        <option value="DOCE">Doce</option>
                        <option value="BEBIDA">Bebida</option>
                        <option value="ACOMPANHAMENTO">Acompanhamento</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tempo de Preparo (minutos)</label>
                    <input
                        type="number"
                        {...register("tempoPreparo", { valueAsNumber: true })}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        {...register("status")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Produto Ativo</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Criar Produto
                </button>
            </form>
        </div>
    )
}
