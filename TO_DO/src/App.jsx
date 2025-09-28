import { useEffect, useState } from 'react';
import { Trash2, FilePenLine } from 'lucide-react';
import './App.css';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, settodo] = useState("");

  const [todos, settodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {

        return JSON.parse(savedTodos);
      } catch (e) {

        console.error("Failed to parse todos from localStorage");
        return [];
      }
    }

    return [];
  });

  const [showfinished, setshowfinished] = useState(true);




  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);



  const handleDelete = (e, id) => {
    settodos(todos.filter(item => item.tid !== id));
  };

  const handleEdit = (e, id) => {
    const newtodoText = prompt("Enter the new todo");
    if (newtodoText) {
      settodos(todos.map(item => item.tid === id ? { ...item, todo: newtodoText } : item));
    }
  };

  const handleChange = (e) => {
    settodo(e.target.value);
  };

  const handleAdd = () => {
    if (todo.length > 0) {
      settodos([...todos, { todo, isCompleted: false, tid: uuidv4() }]);
      settodo("");
    }
  };

  const handleCheckbox = (e) => {
    const id = e.target.id;
    settodos(todos.map(item => item.tid === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  const toggleshow = () => {
    setshowfinished(!showfinished);
  };


  return (
    <>
      <div className=''>
        <Navbar />
        <div className="border-3 border-black mx-3 sm:mx-30 md:mx-50 xl:mx-70 2xl:mx-100 mt-10 p-5 rounded-lg">
          <div className="head text-4xl font-bold">Your Todos</div>
          <div className="body h-full mt-3">
            <div className="add flex gap-2">
              <input type="text" onChange={handleChange} value={todo} placeholder='Add todo' className='px-2 border-2 w-3/4 rounded-lg' />
              <button onClick={handleAdd} className='font-bold w-1/4 max-w-[101px] py-3 px-4 rounded-2xl bg-black text-white cursor-pointer'>Add</button>
            </div>
            <div className="show flex items-center gap-2 select-none">
              <input type="checkbox" onChange={toggleshow} checked={showfinished} id="showfinished" className='size-5 cursor-pointer mt-4 ' />
              <label htmlFor="showfinished" className='font-bold mt-4'>Show Finished Todos</label>
            </div>

            <div className="todos border-2 p-5 flex flex-col rounded-lg gap-5 mt-3">
              {todos.length === 0 && <div>No todos to display!</div>}


              {todos
                .filter(item => showfinished ? true : !item.isCompleted)
                .map(item => (
                  <div key={item.tid} className="todo flex justify-between">
                    <div className="Task flex gap-2 font-medium select-none items-center">
                      <input onChange={handleCheckbox} checked={item.isCompleted} type="checkbox" id={item.tid} className='size-5 cursor-pointer' />
                      <label htmlFor={item.tid} className={`cursor-pointer ${item.isCompleted ? "line-through" : ""}`}>{item.todo}</label>
                    </div>
                    <div className="func flex gap-2">
                      <button onClick={(e) => handleEdit(e, item.tid)} className="edit cursor-pointer"><FilePenLine /></button>
                      <button onClick={(e) => handleDelete(e, item.tid)} className="delete cursor-pointer"><Trash2 /></button>
                    </div>
                  </div>
                ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;