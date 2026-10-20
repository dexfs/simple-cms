import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/global.css'

import AppRouter from "./app/router.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
)
