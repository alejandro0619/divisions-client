import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "./validationSchema";
import { z } from "zod";

type FormData = z.infer<typeof loginSchema> | z.infer<typeof registerSchema>;

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const schema = isLogin ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    const endpoint = isLogin ? "http://localhost:3000/login" : "http://localhost:3000/register";
    const body = JSON.stringify({
      username: data.username,
      password: data.password,
    });
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
        return;
      }
  
      const result = await response.json();
  
      // Verificar respuesta exitosa o con error
      if (result.message) {
        // Éxito: Almacenar username y redirigir
        localStorage.setItem("username", data.username); // Guarda el username
        alert(isLogin ? "¡Inicio de sesión exitoso!" : "¡Registro exitoso!");
        window.location.href = "/dashboard"; // Redirigir al dashboard
      } else if (result.error) {
        // Error: Mostrar mensaje de error
        alert(`Error: ${result.error}`);
      } else {
        // Respuesta inesperada
        alert("Error inesperado en la respuesta del servidor.");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Hubo un problema con la solicitud. Por favor, inténtalo de nuevo.");
    }
  };
  

  return (
    <main>
      <div className="bg-gradient-to-r from-gradientStart to-gradientEnd h-screen w-screen flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-96 p-10">
          <h1 className="text-3xl font-bold text-center">
            {isLogin ? "¡Hola de nuevo!" : "¡Bienvenido!"}
          </h1>
          <p className="text-2xl text-center">
            {isLogin
              ? "Inicia sesión para continuar"
              : "Regístrate para empezar"}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-xl font-medium text-gray-700"
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-xl font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xl font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {"confirmPassword" in errors && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gradientStart to-gradientEnd text-white py-2 rounded-md text-xl transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              {isLogin ? "Login" : "Registrarse"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:underline focus:outline-none"
            >
              {isLogin
                ? "¿No tienes una cuenta? Regístrate"
                : "¿Ya tienes una cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
