import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router";
import LoginPage from "../features/auth/pages/LoginPage.tsx";
import AuthLayout from "../features/auth/layout/AuthLayout.tsx";
import {InternalLayout} from "../components/layout/InternalLayout.tsx";
import PostPage from "../features/posts/pages/PostPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import GuestOnlyRoute from "../components/GuestOnlyRoute.tsx";
import UserPage from "../features/users/pages/UserPage.tsx";
import { PostProvider } from "../features/posts/context/PostContext.tsx";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/posts" replace/>}/>
                <Route element={<GuestOnlyRoute/>}>
                    <Route element={<AuthLayout/>}>
                        <Route path="login" element={<LoginPage/>}/>
                    </Route>
                </Route>
                <Route element={<ProtectedRoute/>}>
                    <Route element={<InternalLayout/>}>
                        <Route element={<PostProvider><Outlet /></PostProvider>}>
                            <Route path="/posts" element={<PostPage/>}/>
                        </Route>
                        <Route path="/users" element={<UserPage/>}/>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/posts" replace/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter