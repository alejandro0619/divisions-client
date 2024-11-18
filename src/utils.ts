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


export const calculateResultLength = (operation: DivisionOperation | null) => {
  if (!operation) return 0;
  const result = operation.dividend / operation.divisor;
  return result.toString().length;
};


export enum PAGE_ACTION {
  NEXT,
  BACK
}
/*
 Describes the user interaction with the buttons: "Volver" and "Siguiente" which are options that are declared in the enum PAGE_ACTION. 
 Refer to the function's internal code to understand its functionality.
*/
export const handlePage = (action: PAGE_ACTION, page: number) => {

  if (action === PAGE_ACTION.BACK) {
    page = page == 1 ? page : page - 1; // If page is 1, then return itself, if not and the user wants to go back, substract 1.
    window.location.href = `/dashboard?page=${page}` // And redirect
  } else {
    page = page === 3 ? page : page + 1; // If page is 3, return itself, if not and the user wants to go forward, add 1.
    window.location.href = `/dashboard?page=${page}` // And redirect
  }
}