import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../../hooks/useLogin";
import { getHomeRoute } from "../utils/getHomeRoute";

import { useToast } from "@/shared/hooks/useToast";
import Toast from "@/shared/components/Toast";
import { TOAST_TYPES } from "@/shared/types/ToastType";
import { useAbortableTask } from "@/shared/hooks/useAbortableTask";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { run, abort } = useAbortableTask();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await run((signal) =>
        mutateAsync({
          username,
          password,
          signal,
        })
      );

      navigate(getHomeRoute(user.roles));
    } catch (error: any) {

      if (error?.name === "RequestAbortedError" || error?.name === "AbortError") {
        return;
      }

      showToast("Credenciales incorrectas", TOAST_TYPES.ERROR);
    }
  };

  return (
    <div className="flex items-center justify-center">
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
          {isPending ? "Ingresando..." : "Ingresar"}
        </button>

    
      </form>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}