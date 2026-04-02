import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import App from './App.tsx'
import Login from './Login.tsx'
import Registro from './Registro.tsx'
import Detalhes from './Detalhes.tsx'
import Perfil from './Perfil.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useClienteStore } from './context/ClienteContext'

function AppWithPersistence() {
  const { logaCliente } = useClienteStore()

  useEffect(() => {
    const clienteSalvo = localStorage.getItem("clienteKey")
    if (clienteSalvo) {
      try {
        const cliente = JSON.parse(clienteSalvo)
        logaCliente(cliente)
      } catch (error) {
        console.error("Erro ao carregar cliente do localStorage:", error)
        localStorage.removeItem("clienteKey")
      }
    }
  }, [logaCliente])

  const rotas = createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,
      children: [
        { index: true, element: <App />},
        { path: 'login', element: <Login /> },
        { path: 'cadastro', element: <Registro/>},
        { path: 'detalhes/:produtoId', element: <Detalhes /> },
        { path: 'perfil', element: <Perfil /> },
      ],
    },
  ])

  return <RouterProvider router={rotas} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithPersistence />
  </StrictMode>,
)
