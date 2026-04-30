// ===== IMPORTAÇÕES =====
// Importa StrictMode do React (para detecção de efeitos colaterais)
import { StrictMode } from 'react'
// Importa createRoot para renderizar a aplicação no DOM
import { createRoot } from 'react-dom/client'
// Importa estilos CSS globais da aplicação
import './index.css'

// Importa os componentes principais (páginas) da aplicação
import App from './App.tsx'           // Página inicial com lista de produtos
import Login from './pages/Login.tsx'       // Página de login
import Registro from './pages/Registro.tsx' // Página de cadastro
import Detalhes from './pages/Detalhes.tsx' // Página de detalhes do produto
import Perfil from './pages/Perfil.tsx'     // Página de perfil do cliente
import CadastroProduto from './pages/CadastroProduto.tsx' // Página de cadastro de produto
import Admin from './pages/Admin.tsx'
import Graficos from './pages/Graficos.tsx'

import Layout from './Layout.tsx'
// Importa ferramentas de roteamento do React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// Importa o hook de estado global do cliente (Zustand)

// ===== COMPONENTE: APP WITH PERSISTENCE =====
// Componente que gerencia a persistência de autenticação
// Verifica se existe cliente salvo no localStorage e faz login automático


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
        { path: 'detalhes/:produtoId', element: <Detalhes id={0} clienteId={''} produtoId={0} createdAt={''} produto={{
          id: 0,
          descricao: '',
          preco: 0,
          foto: '',
          ingredientes: '',
          Tipo: '',
          tempoPreparo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: false,
          restauranteId: 0,
          restaurante: {
            id: 0,
            nome: ''
          }
        }} cliente={{
          id: '',
          nome: '',
          email: ''
        }} status={'PENDENTE'} /> },
        // Rota de cadastro de produto - formulário compatível com o backend
        { path: 'cadastro-produto', element: <CadastroProduto /> },
        // Rota do perfil - exibe pedidos do cliente logado
        { path: 'perfil', element: <Perfil /> },
        // Rota do painel administrativo
        { path: 'admin', element: <Admin /> },
        // Rota de gráficos - visualização de dados
        { path: 'graficos', element: <Graficos /> },
      ],
    },
  ])

  // Renderiza o RouterProvider com as rotas configuradas

// ===== RENDERIZAÇÃO =====
// Renderiza o componente AppWithPersistence no elemento HTML com id "root"
createRoot(document.getElementById('root')!).render(
  // StrictMode: Modo de desenvolvimento que detecta problemas potenciais
  <StrictMode>
    <RouterProvider router = {rotas} />
  </StrictMode>,
)
