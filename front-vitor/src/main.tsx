// ===== IMPORTAÇÕES =====
// Importa StrictMode e useEffect do React (para detecção de efeitos colaterais e hooks)
import { StrictMode, useEffect } from 'react'
// Importa createRoot para renderizar a aplicação no DOM
import { createRoot } from 'react-dom/client'
// Importa estilos CSS globais da aplicação
import './index.css'

// Importa os componentes principais (páginas) da aplicação
import App from './App.tsx'           // Página inicial com lista de produtos
import Login from './Login.tsx'       // Página de login
import Registro from './Registro.tsx' // Página de cadastro
import Detalhes from './Detalhes.tsx' // Página de detalhes do produto
import Perfil from './Perfil.tsx'     // Página de perfil do cliente
import CadastroProduto from './CadastroProduto.tsx' // Página de cadastro de produto

import Layout from './Layout.tsx'
// Importa ferramentas de roteamento do React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// Importa o hook de estado global do cliente (Zustand)
import { useClienteStore } from './context/ClienteContext'

// ===== COMPONENTE: APP WITH PERSISTENCE =====
// Componente que gerencia a persistência de autenticação
// Verifica se existe cliente salvo no localStorage e faz login automático
function AppWithPersistence() {
  // Hook para fazer login do cliente no Zustand
  const { logaCliente } = useClienteStore()

  // Effect para restaurar autenticação do localStorage ao carregar
  useEffect(() => {
    // Obtém os dados do cliente salvos no localStorage
    const clienteSalvo = localStorage.getItem("clienteKey")
    if (clienteSalvo) {
      try {
        // Converte JSON string para objeto
        const cliente = JSON.parse(clienteSalvo)
        // Faz login automático com dados salvos
        logaCliente(cliente)
      } catch (error) {
        // Se houver erro ao parsear JSON, remove dados corrompidos
        console.error("Erro ao carregar cliente do localStorage:", error)
        localStorage.removeItem("clienteKey")
      }
    }
  }, [logaCliente])

  // ===== CONFIGURAÇÃO DE ROTAS =====
  // Define todas as rotas da aplicação
  const rotas = createBrowserRouter([
    {
      // Rota pai que contém o Layout (cabeçalho) e renderiza componentes filhos
      path: '/',
      element: <Layout/>,
      children: [
        // Rota inicial - lista de produtos
        { index: true, element: <App />},
        // Rota de login - autenticação de cliente
        { path: 'login', element: <Login /> },
        // Rota de cadastro - registro de novo cliente
        { path: 'cadastro', element: <Registro/>},
        // Rota dinâmica de detalhes do produto (recebe ID do produto)
        { path: 'detalhes/:produtoId', element: <Detalhes /> },
        // Rota de cadastro de produto - formulário compatível com o backend
        { path: 'cadastro-produto', element: <CadastroProduto /> },
        // Rota do perfil - exibe pedidos do cliente logado
        { path: 'perfil', element: <Perfil /> },
      ],
    },
  ])

  // Renderiza o RouterProvider com as rotas configuradas
  return <RouterProvider router={rotas} />
}

// ===== RENDERIZAÇÃO =====
// Renderiza o componente AppWithPersistence no elemento HTML com id "root"
createRoot(document.getElementById('root')!).render(
  // StrictMode: Modo de desenvolvimento que detecta problemas potenciais
  <StrictMode>
    <AppWithPersistence />
  </StrictMode>,
)
