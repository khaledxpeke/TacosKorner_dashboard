import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AlertDialog = ({ open, handleClose,name }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Supprimer</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Voulez vous supprimer ce {name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          style={{ color: "white" }}
          onClick={handleClose}
        >
          Non
        </Button>
        <Button
          variant="contained"
          color="success"
          style={{ color: "white" }}
          onClick={handleClose}
          autoFocus
        >
          Oui
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AlertDialog;
