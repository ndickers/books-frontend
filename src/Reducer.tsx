import { TAction, TBook } from "./types.ts";

export function reducer(state: TBook[], action: TAction): TBook[] {
  switch (action.type) {
    case "set books":
      return (state = action.payload);
    case "set books error":
      return [action.payload];
    case "add-note":
      return [...state, action.payload];
    case "delete":
      return state.filter((book) => book.id !== action.payload.bookId);
    case "edit book":
      return state.map((book) =>
        book.id === action.payload.id ? action.payload.data : book
      );
    default:
      throw new Error("Unknown action");
  }
}
