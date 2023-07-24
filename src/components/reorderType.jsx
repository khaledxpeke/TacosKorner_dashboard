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
import "../reorderType.css";

const ReorderType = ({onDragEnd,types}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const colors = tokens(theme.palette.mode);
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
                    key={type._id.toString()}
                    draggableId={type._id.toString()}
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
