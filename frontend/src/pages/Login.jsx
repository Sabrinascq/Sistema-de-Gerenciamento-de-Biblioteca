import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            const resposta = await api.post("/auth/login", {

                email,
                senha

            });

            localStorage.setItem("token", resposta.data.token);
            localStorage.setItem("usuario", JSON.stringify(resposta.data.user));

            alert("Login realizado com sucesso!");

            navigate("/livros");

        } catch (erro) {

            alert("E-mail ou senha inválidos.");

        }

    }

    return (

        <div style={estilos.container}>

            <form
                onSubmit={fazerLogin}
                style={estilos.form}
            >

                <h1>Sistema Biblioteca</h1>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <button>

                    Entrar

                </button>

            </form>

        </div>

    );

}

const estilos = {

    container: {

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f4f4"

    },

    form: {

        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "320px",
        padding: "30px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,.2)"

    }

};

export default Login;