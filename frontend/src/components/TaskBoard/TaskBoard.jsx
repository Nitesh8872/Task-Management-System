import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../TaskCard/TaskCard";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../../utils/taskStatus";
import "./TaskBoard.css";

function TaskBoard({ tasks, onEdit, onComplete, onDelete, onStatusChange }) {
  // Map statuses to board columns using canonical constants
  const columns = {
    [TASK_STATUS.PENDING]: {
      id: TASK_STATUS.PENDING,
      title: TASK_STATUS_LABELS[TASK_STATUS.PENDING],
      tasks: tasks.filter((t) => t.status === TASK_STATUS.PENDING),
      emoji: "📋",
      className: "col-pending",
      emptyText: "No pending tasks",
    },
    [TASK_STATUS.IN_PROGRESS]: {
      id: TASK_STATUS.IN_PROGRESS,
      title: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS],
      tasks: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS),
      emoji: "⏳",
      className: "col-in-progress",
      emptyText: "No tasks in progress",
    },
    [TASK_STATUS.COMPLETED]: {
      id: TASK_STATUS.COMPLETED,
      title: TASK_STATUS_LABELS[TASK_STATUS.COMPLETED],
      tasks: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED),
      emoji: "✅",
      className: "col-completed",
      emptyText: "No completed tasks",
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
                    <div className="kanban-board-empty">{column.emptyText}</div>
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
