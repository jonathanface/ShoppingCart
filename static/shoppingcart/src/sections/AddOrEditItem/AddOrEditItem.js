import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {setAddingOrEditingItemState} from '../../store/AddingOrEditingItemSlice';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import { getItems } from '../../store/ItemsSlice'

import LastPageIcon from '@mui/icons-material/LastPage';
import '../../css/modal.css';

const AddOrEditItem = (props) => {

  const [currentError, setCurrentError] = useState(null);
  const [currentName, setCurrentName] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentQty, setCurrentQty] = useState(1);
  const dispatch = useDispatch();
  const isAddingOrEditingItem = useSelector((state) => state.isAddingOrEditingItem.value);
  
  const handleClose = () => {
    resetForm();
    dispatch(setAddingOrEditingItemState(false));
  };

  const resetForm = () => {
    setCurrentDescription("");
    setCurrentName("");
    setCurrentQty(1);
    setCurrentError("");
  }

  const handleSubmit = () => {
    if (!currentName.trim().length) {
      setCurrentError('Name cannot be blank');
      return;
    }
    if (currentQty < 1) {
      setCurrentError('Quantity must be > 0');
      return;
    }
    const params = {};
    params.name = currentName;
    params.description = currentDescription;
    params.quantity = currentQty;

    fetch('/api/items/put', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then((response) => {
      if (response.ok) {
        dispatch(getItems())
        handleClose();
      } else {
        setCurrentError(response.text);
      }
    });
  };

  const quantityOptions = [];
  for (let i=1; i < 11; i++) {
      quantityOptions.push(<MenuItem key={"quantity_" + i} value={i}>{i}</MenuItem>)               
  }
  return (
    <div>
      <Dialog open={isAddingOrEditingItem} className="overlay" onClose={handleClose}>
        <header >SHOPPING LIST<LastPageIcon onClick={handleClose}/></header>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {m: 1, width: 300},
            }}>
              <div>
                <div className="subtitle">
                  <h4>Add an Item</h4>
                  <div>Add your new item below</div>
                </div>
                <FormControl fullWidth required>
                  <TextField
                    required
                    label="Item Name"
                    placeholder="Item Name"
                    value={currentName}
                    onChange={(event) => {
                      setCurrentName(event.target.value)
                    }}
                  />
                </FormControl>
                <FormControl fullWidth >
                  <TextField
                    label="Description"
                    placeholder="Description"
                    value={currentDescription}
                    onChange={(event) => {
                      setCurrentDescription(event.target.value);
                    }}
                    rows={4}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel >How many?</InputLabel>
                  <Select
                    id="quantity-required"
                    value={currentQty}
                    placeholder="How many?"
                    label="How many?"
                    sx={{
                      padding: "8px",
                      marginTop: "10px"
                    
                    }}
                    onChange={(event) => {
                      setCurrentQty(event.target.value);
                    }}
                  >
                    {quantityOptions}
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>

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

export default AddOrEditItem;
