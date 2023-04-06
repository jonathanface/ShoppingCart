import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import {flipAddingItemState} from '../../store/AddingItemSlice';
import { getItems } from '../../store/ItemsSlice'
import LastPageIcon from '@mui/icons-material/LastPage';
import '../../css/modal.css';

const AddItem = () => {

  const [currentError, setCurrentError] = useState(null);
  const dispatch = useDispatch();
  const isAddingItem = useSelector((state) => state.isAddingItem.value);
  const [formInput, setFormInput] = React.useState(new Map());

  const { items, loading, error } = useSelector((state) => state.items)
  useEffect(() => {
    dispatch(getItems())
  }, [dispatch]);

  if (loading === 'idle' && items) {
    //console.log("wtf", items);
  }

  const cartItems = items ? items.map(item => {
    return {"label":item.name, "id":item.id, "description":item.description}
  }) : []

  const handleClose = () => {
    dispatch(flipAddingItemState());
  };

  const handleSubmit = () => {
    console.log("data to send", formInput);
    if (!formInput['name'] || !formInput['name'].trim().length) {
      setCurrentError('Name cannot be blank');
      return;
    }
    if (formInput['quantity'] < 1) {
      setCurrentError('Quantity must be > 0');
      return;
    }
    fetch('/api/items/put', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formInput)
    }).then((response) => {
      if (response.ok) {
        console.log("SCUCESS")
        handleClose();
      }
    });
  };

  return (
    <div>
      <Dialog open={isAddingItem} className="overlay" onClose={handleClose}>
        <header >SHOPPING LIST<LastPageIcon onClick={handleClose}/></header>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {m: 1, width: 300},
            }}>
              <div>
                <h4>Add an Item</h4>
                <Autocomplete
                  required
                  onInputChange={(event) => {
                    formInput['name'] = event.target.value;
                    setFormInput(formInput);
                  }}
                  onChange={(event, actions) => {
                    
                  }}
                  freeSolo
                  options={cartItems}
                  renderInput={(params) => <TextField {...params} label="Item Name" />}
                />
                <TextField
                  label="Description"
                  placeholder="Description"
                  onChange={(event) => {
                    formInput['description'] = event.target.value;
                    setFormInput(formInput);
                  }}
                  multiline
                />
                <TextField
                  label="How Many?"
                  type="number"
                  required
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  onChange={(event) => {
                    formInput['quantity'] = parseInt(event.target.value);
                    setFormInput(formInput);
                  }}
                />
              </div>
              <div className="error">{currentError}</div>
            </Box>
          </DialogContent>
          <DialogActions>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </DialogActions>
        </Dialog>
    </div>
  )
}

export default AddItem;
