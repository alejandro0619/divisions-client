import { DivisionOperation } from "./types";

export const generateDivisions = async (): Promise<void> => {
  try {
    const username = localStorage.getItem("username");

    const response = await fetch("http://localhost:8000/generate-divisions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    // Intentar obtener datos JSON
    let data;
    try {
      data = await response.json();
      console.log("Datos recibidos:", data);
    } catch (error) {
      throw new Error("No se pudo parsear la respuesta como JSON");
    }

  } catch (error) {
    console.error("Error generando divisiones:", error);
  }
};

export const fetchDivisions = async (): Promise<DivisionOperation[] | null> => {
  try {
    // Obtener el nombre de usuario desde local
    const username = localStorage.getItem("username");

    const response = await fetch("http://localhost:8000/get-divisions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener las divisiones");
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching divisions:", error);
    return null;
  }
};