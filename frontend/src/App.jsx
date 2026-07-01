import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Livros from "./pages/Livros";
import Leitores from "./pages/Leitores";
import Emprestimos from "./pages/Emprestimos";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/livros"
                element={<Livros />}
            />

            <Route
                path="/leitores"
                element={<Leitores />}
            />

            <Route
                path="/emprestimos"
                element={<Emprestimos />}
            />

        </Routes>

    );

}

export default App;