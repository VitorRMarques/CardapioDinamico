import { useEffect, useState } from "react"
import type { ProdutoType } from "./ProdutoType"

const apiUrl = import.meta.env.VITE_API_URL ?? ""

export function Dashboard() {
  const [products, setProducts] = useState<ProdutoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/produtos`)
      if (!res.ok) throw new Error("Erro ao buscar produtos")
      const data = await res.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div className="p-4">Carregando...</div>
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <img src={product.foto} alt={product.descricao} className="w-full h-48 object-cover rounded mb-2" />
            <h2 className="font-semibold text-lg">{product.descricao}</h2>
            <p className="text-gray-600">R$ {Number(product.preco).toFixed(2)}</p>
            <p className="text-sm text-gray-500">{product.Tipo}</p>
            {product.tempoPreparo && <p className="text-sm">Tempo: {product.tempoPreparo}min</p>}
          </div> 
        ))}
      </div>
    </div>
  )
}
