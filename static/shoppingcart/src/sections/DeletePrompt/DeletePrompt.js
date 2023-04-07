import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import {useSelector, useDispatch} from 'react-redux';
import {setDeletingItemState} from '../../store/DeletingItemStateSlice';
import {getItems} from '../../store/ItemsSlice';

const DeletePrompt = (props) => {
  const visible = useSelector((state) => state.isDeletingItem.value);
  const dispatch = useDispatch();

  console.log('props', props);

  const handleClose = () => {
    dispatch(setDeletingItemState(false));
  };

  const handleSubmit = () => {
    const params = {};
    params.id = props.item;
    fetch('/api/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([params])
    }).then((response) => {
      if (response.ok) {
        dispatch(getItems());
        handleClose();
      }
    });
  };

  console.log('viS', visible);

  return (
    <Dialog open={visible} className="delete-dialog" sx={{
      '.MuiPaper-root': {
        padding: '30px',
        maxWidth: '400px'
      },
    }}>
      <DialogTitle>Delete Item?</DialogTitle>
      <DialogContent sx={{fontSize: '0.9rem'}}>Are you sure you want to delete this item? This cannot be undone.</DialogContent>
      <DialogActions>
        <Button variant="text" sx={{color: 'rgba(0, 0, 0, 0.87)'}} onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePrompt;
