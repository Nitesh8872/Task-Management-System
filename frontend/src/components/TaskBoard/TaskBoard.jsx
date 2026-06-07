import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../TaskCard/TaskCard";
import "./TaskBoard.css";

function TaskBoard({ tasks, onEdit, onComplete, onDelete, onStatusChange }) {
  // Map statuses to board columns
  const columns = {
    pending: {
      id: "pending",
      title: "Todo",
      tasks: tasks.filter((t) => t.status === "pending"),
      emoji: "📋",
      className: "col-todo",
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      tasks: tasks.filter((t) => t.status === "in-progress"),
      emoji: "⏳",
      className: "col-in-progress",
    },
    completed: {
      id: "completed",
      title: "Completed",
      tasks: tasks.filter((t) => t.status === "completed"),
      emoji: "✅",
      className: "col-completed",
    },
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside or no change
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Call state updater
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.values(columns).map((column) => (
          <div key={column.id} className={`kanban-column ${column.className}`}>
            <div className="column-header">
              <h2>
                <span>{column.emoji}</span> {column.title}
              </h2>
              <span className="column-badge">{column.tasks.length}</span>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-list ${
                    snapshot.isDraggingOver ? "drag-over" : ""
                  }`}
                >
                  {column.tasks.length === 0 ? (
                    <div className="kanban-board-empty">No tasks in this list</div>
                  ) : (
                    column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, draggableSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: draggableSnapshot.isDragging ? 0.9 : 1,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onComplete={onComplete}
                              onDelete={onDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskBoard;
