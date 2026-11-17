import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, editTask, deleteTask } from '../redux/taskSlice';

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);
  const dispatch = useDispatch();

  const handleSave = () => {
    if (!newDescription.trim()) return;
    dispatch(editTask({ id: task.id, description: newDescription.trim() }));
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.isDone ? 'done' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => {
            setIsEditing(false);
            setNewDescription(task.description);
          }}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <input
            type="checkbox"
            checked={task.isDone}
            onChange={() => dispatch(toggleTask(task.id))}
          />
          <span
            style={{
              textDecoration: task.isDone ? 'line-through' : 'none',
            }}
          >
            {task.description}
          </span>
          <div className="actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;