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

const ReorderType = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const colors = tokens(theme.palette.mode);
  const ingrediantsTypes = [
    {
      _id: 1,
      name: "sauce",
    },
    {
      _id: 2,
      name: "meat",
    },
    {
      _id: 3,
      name: "others",
    },
    {
      _id: 4,
      name: "Sans Ingrediant",
    },
  ];
  return (
    <DragDropContext>
      <Droppable droppableId="Types">
        {(provided) => (
          <TableContainer {...provided.droppableProps} ref={provided.innerRef}>
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
                {ingrediantsTypes.map(({ _id, name }, index) => (
                  <Draggable key={_id} draggableId={_id} index={index}>
                    {(provided) => (
                      <TableRow
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
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
