import {BrowserRouter, Route, Routes} from "react-router";
import App from "./App.tsx";
import LoginPage from "../features/auth/pages/LoginPage.tsx";
import AuthLayout from "../features/auth/layout/AuthLayout.tsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter