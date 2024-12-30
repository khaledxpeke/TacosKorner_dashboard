import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#2E4065" : "transparent",
    cursor: "grab",
    "&:active": {
      cursor: "grabbing",
      backgroundColor: "#2E4065",
    },
    "&:hover": {
      backgroundColor: "#1a2035",
    },
  };

  return (
    <tr
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </tr>
  );
};

const Reorder = ({ items, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#1F2A40",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#141B2D",
              borderBottom: "1px solid #2E4065",
            }}
          >
            <th
              style={{
                padding: "12px",
                textAlign: "left",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Ordre
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "left",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Nom
            </th>
          </tr>
        </thead>
        <tbody>
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableItem key={item._id} id={item._id}>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #2E4065",
                    color: "#fff",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #2E4065",
                    color: "#fff",
                    cursor: "grab",
                  }}
                >
                  {item.name}
                </td>
              </SortableItem>
            ))}
          </SortableContext>
        </tbody>
      </table>
    </DndContext>
  );
};
export default Reorder;
