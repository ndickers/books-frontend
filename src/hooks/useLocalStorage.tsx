import { reducer } from "../Reducer";
import { useReducer, useEffect } from "react";
import axios from "axios";
import { TBook, TAction } from "../types.ts";

async function getAllBook(): Promise<TBook[] | null> {
  try {
    const response = await axios(
      "https://books-api-rsnz.onrender.com/api/books"
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
}

export function useLocalStorage(): [TBook[] | null, React.Dispatch<TAction>] {
  const [books, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllBook();
      if (data === null) {
        dispatch({
          type: "set books error",
          payload: { title: "error", author: "error", year: 404 },
        });
      } else {
        dispatch({ type: "set books", payload: data });
      }
    }
    fetchData();
  }, []);

  return [books, dispatch];
}
