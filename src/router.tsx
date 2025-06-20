import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./components/login-page";
import { ProtectedRoute } from "./components/protected-route";
import { AuthenticatedLayout } from "./components/authenticated-layout";
import { useAuth } from "./contexts/auth-context";
import { HomePage } from "./pages/Home/home";
import { NotFoundPage } from "./pages/NotFound/not-found";
import { TasksPage } from "./pages/Tasks/tasks";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />

      {/* Rotas protegidas com layout autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Rota para página não encontrada */}
        </Route>
      </Route>
    </Routes>
  );
}
