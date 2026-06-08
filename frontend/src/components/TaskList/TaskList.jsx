function TaskList({ tasks }) {
    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id || task.id} style={{ marginBottom: '10px' }}>
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