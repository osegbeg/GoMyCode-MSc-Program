import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../redux/taskSlice';
import Task from './Task';

function ListTask() {
  const { tasks, filter } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  // Filter tasks based on Redux filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') return task.isDone === true;
    if (filter === 'not') return task.isDone === false;
    return true; // 'all'
  });

  return (
    <div className="list-task-container">
      {/* Filter Controls */}
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => dispatch(setFilter('all'))}
        >
          All ({tasks.length})
        </button>
        <button
          className={filter === 'done' ? 'active' : ''}
          onClick={() => dispatch(setFilter('done'))}
        >
          Done ({tasks.filter((t) => t.isDone).length})
        </button>
        <button
          className={filter === 'not' ? 'active' : ''}
          onClick={() => dispatch(setFilter('not'))}
        >
          Not Done ({tasks.filter((t) => !t.isDone).length})
        </button>
      </div>

      {/* Filtered Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-msg">No tasks found for this filter.</p>
        ) : (
          filteredTasks.map((task) => <Task key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default ListTask;