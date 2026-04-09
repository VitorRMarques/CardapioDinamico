// ===== IMPORTAÇÕES =====
// Importa Titulo (cabeçalho) para exibir no topo da página
import Titulo from './components/Titulo'
// Importa Outlet do React Router para renderizar componentes de rotas filhas
import { Outlet} from 'react-router-dom'

// Importa Toaster para exibir notificações (toast messages)
import {Toaster} from 'sonner'

// ===== COMPONENTE: LAYOUT =====
// Componente layout que envolve todas as páginas
// Fornece cabeçalho (Titulo) e sistema de notificações
export default function Layout() {
    return(
        <>
          {/* Cabeçalho da aplicação com logo e menu */}
          <Titulo />
          
          {/* Outlet renderiza o componente da rota filha correspondente */}
          <Outlet />
          
          {/* Toaster: sistema de notificações toast */}
          {/* richColors: usa cores ao invés de preto/branco */}
          {/* position: exibe notificações no topo centro da tela */}
          <Toaster richColors position="top-center" />
        </>
    )
}