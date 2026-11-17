import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    { id: 1, description: 'Master Redux Toolkit fundamentals', isDone: true },
    { id: 2, description: 'Build the Redux To-Do checkpoint', isDone: false },
  ],
  filter: 'all', // options: 'all' | 'done' | 'not'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // 1. Add a new Todo
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        description: action.payload,
        isDone: false,
      };
      state.tasks.push(newTask); // Redux Toolkit uses Immer under the hood, so this is safe!
    },

    // 2. Toggle isDone status
    toggleTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.isDone = !task.isDone;
      }
    },

    // 3. Edit a task's description
    editTask: (state, action) => {
      const { id, description } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.description = description;
      }
    },

    // 4. Delete a task (good bonus feature)
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    // 5. Set filter ('all', 'done', 'not')
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addTask, toggleTask, editTask, deleteTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;