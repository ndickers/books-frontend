export interface TBook {
  id?: number;
  title: string;
  author: string;
  year: number;
}

interface AddNoteAction {
  type: "add-note";
  payload: TBook;
}

interface DeleteAction {
  type: "delete";
  payload: {
    bookId: number;
  };
}

interface EditBookAction {
  type: "edit book";
  payload: {
    id: number;
    data: TBook;
  };
}
interface setBookAction {
  type: "set books";
  payload: TBook[];
}

interface setBookError {
  type: "set books error";
  payload: TBook;
}

export type TAction =
  | AddNoteAction
  | DeleteAction
  | EditBookAction
  | setBookError
  | setBookAction;
export interface TEdit {
  id: number | null;
  edit: boolean;
}
