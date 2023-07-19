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
    id: "sauce",
    name: "sauce",
  },
  {
    id: "meat",
    name: "meat",
  },
  {
    id: "others",
    name: "others",
  },
  {
    id: "ingrediant",
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
    <TableContainer>
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="types">
            {(provided) => (
              <TableBody
                className="types"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {types.map((type, index) => (
                  <Draggable
                    key={type.id}
                    draggableId={type.id}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell>{type.name}</TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </TableContainer>
  );
};

export default ReorderType;
