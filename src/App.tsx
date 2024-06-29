import { ChangeEvent, useState, useEffect } from "react";
import Form from "./components/Form";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Book from "./components/Book";
import axios from "axios";
import { TBook, TEdit } from "./types.ts";

async function updateData(id: number, data: TBook): Promise<TBook[] | null> {
  try {
    const updated = await axios.put(
      ` https://books-api-rsnz.onrender.com/api/books/${id}`,
      data
    );
    return updated?.data.data[0];
  } catch (error) {
    return null;
  }
}
async function addNote(data: TBook) {
  try {
    const response = await axios.post(
      ` https://books-api-rsnz.onrender.com/api/books`,
      data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

function App() {
  const [formData, setFormData] = useState<TBook>({
    title: "",
    author: "",
    year: 0,
    id: 1,
  });
  const [isEdit, setIsEdit] = useState<TEdit>({
    id: null,
    edit: false,
  });
  const [books, dispatch] = useLocalStorage();
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    if (isEdit.edit) {
      const dataToEdit: TBook | undefined = books?.find(
        (book) => book.id === isEdit.id
      );
      if (dataToEdit !== undefined) {
        setFormData(dataToEdit);
      }
    }
  }, [isEdit]);
  function handleFormChange({ target }: ChangeEvent<HTMLInputElement>) {
    setFormData((prevData) => ({ ...prevData, [target?.name]: target?.value }));
  }
  function searching(bookTitle: string, bookList: TBook[] | null) {
    if (bookTitle) {
      return bookList?.filter(({ title }: TBook) =>
        title.toLowerCase().includes(bookTitle.toLowerCase())
      );
    }
    return bookList;
  }

  const filterBooks = searching(searchTitle, books);
  const booksElems = filterBooks?.map((book) => (
    <Book
      key={book?.id}
      deleteDispatch={dispatch}
      id={book?.id as number}
      setIsEdit={setIsEdit}
      title={book?.title}
      author={book?.author}
      year={book?.year}
    />
  ));

  return (
    <div className="pt-8 max-w-[40rem] mx-auto">
      <div>
        <Form
          titleVal={formData.title}
          authorVal={formData.author}
          isEdit={isEdit}
          yearVal={formData.year}
          onChange={handleFormChange}
          onSubmit={(e) => {
            e.preventDefault();
            if (isEdit.edit && isEdit.id !== null) {
              updateData(isEdit.id, formData).then((data) => {
                if (data !== null) {
                  dispatch({
                    type: "edit book",
                    payload: { id: Number(isEdit.id), data: formData },
                  });
                  setIsEdit((prevEdit) => ({ ...prevEdit, edit: false }));
                } else {
                  alert("Unable to update now");
                }
              });
            } else {
              addNote({
                ...formData,
                year: Number(formData.year),
              })
                .then((data) => {
                  console.log(data?.data?.data[0].id);
                  dispatch({
                    type: "add-note",
                    payload: data?.data?.data[0],
                  });
                  setFormData({ title: "", author: "", year: 0 });
                })
                .catch((error) => {
                  alert("Unable to add note");
                  console.log(error);
                });
            }
          }}
        />
        <input
          className="my-3 p-2 w-full border-gray-300 border-2 rounded-md"
          onChange={(e) => {
            setSearchTitle(e.target.value);
          }}
          value={searchTitle}
          type="text"
          name="search"
          placeholder="Search book title"
        />

        <div>
          <table className="w-full text-center">
            <thead>
              <tr className="border-4 border-gray-600  ">
                <th className="th-style">Title</th>
                <th className="th-style">Author</th>
                <th className="th-style">Year</th>
                <th className="th-style">Actions</th>
              </tr>
            </thead>
            <tbody>{booksElems}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
