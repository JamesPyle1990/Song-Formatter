import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function NavBar({showLyricsInput}) {
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='secondary'>
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Charts AF
          </Typography>
          <Button variant="contained" color="primary" onClick={showLyricsInput}>Back</Button>
        </Toolbar>
      </AppBar>
    </Box>
   
    </>
  );
}