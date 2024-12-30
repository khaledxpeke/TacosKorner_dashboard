import { TableCell, TableRow, Typography } from "@mui/material";

const NoDataTable = ({ cols }) => (
  <TableRow>
    <TableCell colSpan={cols} align="center">
      <Typography variant="h3" color="textPrimary">
        Aucune donnée disponible
      </Typography>
    </TableCell>
  </TableRow>
);

export default NoDataTable;
