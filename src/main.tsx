import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/global.css'

import AppRouter from "./app/router.tsx";
import {AuthProvider} from "./components/context/AuthContext.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <AppRouter/>
        </AuthProvider>
    </StrictMode>,
)
