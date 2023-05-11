import { useEffect, useState } from "react";

interface Todo {
  todo_id: number;
  description: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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

  const handleUpdate = () => {
    if (selectedTodo) {
      fetch(`https://pern-todo-backend.onrender.com/todos/${selectedTodo.todo_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: selectedTodo.description,
        }),
      }).then((response) => {
        if (response.ok) {
          const newTodos = todos.map((todo) => {
            if (todo.todo_id === selectedTodo.todo_id) {
              return {
                ...todo,
                description: selectedTodo.description,
              };
            } else {
              return todo;
            }
          });
          setTodos(newTodos);
          setSelectedTodo(null);
          setShowModal(false);
        }
      });
    }
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

  const handleShowModal = (id: number, description: string) => {
    setSelectedTodo({
      todo_id: id,
      description: description,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
    setShowModal(false);
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
          <table className="table">
          <thead>
      <tr>
        <th>ID</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {todos.map((todo) => (
        <tr key={todo.todo_id}>
          <td>{todo.todo_id}</td>
          <td>{todo.description}</td>
          <td>
            <button
              className="btn btn-link ml-2"
              onClick={() => handleShowModal(todo.todo_id, todo.description)}
            >
              Edit
            </button>
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
  {showModal && (
    <div className="modal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Todo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              value={selectedTodo?.description || ""}
              onChange={(e) =>
                setSelectedTodo({
                  ...selectedTodo,
                  description: e.target.value,
                })
              }
              className="form-control"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
}

export default App;
