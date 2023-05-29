import { Box } from "@mui/material";

const Error = ({children}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <strong>{children}</strong> 
    </Box>
  );
};

export default Error;
