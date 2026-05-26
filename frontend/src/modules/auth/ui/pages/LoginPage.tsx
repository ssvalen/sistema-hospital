import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import { getHomeRoute } from "../utils/getHomeRoute";

import Toast from "@/shared/components/Toast";

export default function LoginPage() {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {

      const user = await mutateAsync({
        username,
        password,
      });

      navigate(
        getHomeRoute(user.roles)
      );

    } catch (error) {

      setToast({
        show: true,
        message: "Credenciales incorrectas",
      });

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Sistema Hospitalario
        </h2>

        <input
          className="w-full p-3 border rounded-lg mb-3"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending
            ? "Ingresando..."
            : "Ingresar"}
        </button>

      </form>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() =>
          setToast({
            show: false,
            message: "",
          })
        }
      />

    </div>
  );
}