import React from 'react';

function TaskList({ tasks }) {
    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;