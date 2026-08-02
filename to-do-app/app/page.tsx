"use client" // allerting next.js that this code needs to run client side

import { useState, useEffect } from "react"; // this is needed for the buttons to work
import supabase from "./helper/SupabaseClient";

// 1. Fetch the stored Tasks from Supabase
// 2. Store them in a list
// 3. Show them on screen

export default function Home() {

  const [tasks, setTask] = useState<any[]>([]); //default is empty array
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchTasks(); // so it runs on the initial render of the page
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: true });
    setErrorMsg("");
    if (error) {
      console.error(error);
      setErrorMsg("An error occurred ! Please try again later!");
    }
    else
      setTask(data);
  }

  async function addTask() {
    if (!title.trim()) return;
    setErrorMsg("");
    const { error } = await supabase.from("tasks").insert([{ title }]);
    if (error) {
      console.error(error);
      setErrorMsg("An error occurred ! Please try again later!");
    } else {
      setTitle("");
      fetchTasks();
    }

  }

  async function completeTask(id : number){
    await supabase.from("tasks").update({completed : true}).eq("id",id);
    fetchTasks(); // an record is updated, the updated list needs to be rendered
  }

  async function deleteTask( id: number)
  {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  }

  async function updateTask(id : number , newTitle : any)
  {
    await supabase.from("tasks").update({title : newTitle}).eq("id",id);
    fetchTasks();
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Todo List</h1>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Add task" />
        <button onClick={addTask}>Add</button>
        <h2>Your Tasks ! </h2>
        <div>
          {tasks.filter((t) => !t.completed).map((task) => (
            <div key={task.id}>
              <span>{task.title}</span>
              <button onClick={ () => completeTask(task.id)}>Complete</button>
              <button onClick = { () => updateTask(task.id , prompt("Add a new title!:", task.title))}>Update</button>
              <button onClick = { () => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
        <h2>Tasks from the Past</h2>
         <div>
          {tasks.filter((t) => t.completed).map((task) => (
            <div key={task.id}>
              <span>{task.title}</span>
              <button onClick={ () => completeTask(task.id)}>Complete</button>
              <button onClick = { () => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
