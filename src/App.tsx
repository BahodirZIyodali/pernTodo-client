import { useEffect, useState } from "react";

interface Todo {
  todo_id: number;
  description: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleCreate = () => {
    fetch("https://pern-todo-backend.onrender.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setDescription("");
      });
  };

  const handleUpdate = (id: number, newDescription: string) => {
    fetch(`https://pern-todo-backend.onrender.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: newDescription,
      }),
    }).then((response) => {
      if (response.ok) {
        const newTodos = todos.map((todo) => {
          if (todo.todo_id === id) {
            return {
              ...todo,
              description: newDescription,
            };
          } else {
            return todo;
          }
        });
        setTodos(newTodos);
      }
    });
  };

  const handleDelete = (id: number) => {
    fetch(`https://pern-todo-backend.onrender.com/todos/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        const newTodos = todos.filter((todo) => todo.todo_id !== id);
        setTodos(newTodos);
      }
    });
  };

  useEffect(() => {
    fetch("https://pern-todo-backend.onrender.com/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="d-flex flex-column justify-content-center  mb-5">
        <h3 className="text-center">Add Todo</h3>
        <input
          type="text"
          value={description}
          onChange={handleChange}
          className="form-control w-25"
          placeholder="Enter todo description"
        />
        <button className="btn btn-primary mt-2 w-25" onClick={handleCreate}>
          Create
        </button>
      </div>
      <div className=" d-flex flex-column justify-content-center">
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.todo_id}>
                <td>
                  <input
                    type="text"
                    value={todo.description}
                    onChange={(e) => handleUpdate(todo.todo_id, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(todo.todo_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
