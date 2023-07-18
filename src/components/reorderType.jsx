import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { useState } from "react";
import "../reorderType.css";
const ingrediantsTypes = [
  {
    _id: "1",
    name: "sauce",
  },
  {
    _id: "2",
    name: "meat",
  },
  {
    _id: "3",
    name: "others",
  },
  {
    _id: "4",
    name: "Sans Ingrediant",
  },
];
const ReorderType = () => {
  const [types, updateTypes] = useState(ingrediantsTypes);
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const colors = tokens(theme.palette.mode);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTypes = Array.from(types);
    const [reorderedItem] = updatedTypes.splice(result.source.index, 1);
    updatedTypes.splice(result.destination.index, 0, reorderedItem);

    updateTypes(updatedTypes);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="types">
        {(provided) => (
          <TableContainer  className="table-container" {...provided.droppableProps} ref={provided.innerRef}>
            <Table
              sx={{
                backgroundColor: isLightMode ? "#F0F0F7" : colors.primary[400],
              }}
            >
              <TableHead
                sx={{
                  backgroundColor: colors.primary[700],
                }}
              >
                <TableRow>
                  <TableCell>Nom</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {types.map(({ _id, name }, index) => (
                  <Draggable
                    key={_id}
                    draggableId={_id}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        className="drag-handle"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell>{name}</TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ReorderType;
