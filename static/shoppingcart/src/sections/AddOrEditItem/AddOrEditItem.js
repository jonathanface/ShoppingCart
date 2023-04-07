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
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import { getItems } from '../../store/ItemsSlice'
import LastPageIcon from '@mui/icons-material/LastPage';
import Checkbox from '@mui/material/Checkbox';
import '../../css/modal.css';
import { setEditableItem, resetEditableItem } from '../../store/EditableItemSlice';

const AddOrEditItem = () => {

  const MAX_NAME_LENGTH = 25;
  const MAX_DESCR_LENGTH = 100;

  const [currentError, setCurrentError] = useState(null);
  const dispatch = useDispatch();
  const isAddingOrEditingItem = useSelector((state) => state.isAddingOrEditingItem.value);
  const {editingID, editingQty, editingName, editingDescr, editingPurchased, inEditMode} = useSelector((state) => state.editableItem)
  
  const formTitle = inEditMode ? "Edit an Item" : "Add an Item";
  const formSubtitle = inEditMode ? "Edit your item below" : "Add your new item below"
  const formButtonLabel = inEditMode ? "Save" : "Create"

  const handleClose = () => {
    resetForm();
    dispatch(resetEditableItem())
    dispatch(setAddingOrEditingItemState(false));
  };

  const resetForm = () => {
    setCurrentError("");
  }

  const generateObjectFromCurrentValues =() => {
    return {
      id: editingID,
      quantity: editingQty,
      name: editingName,
      description: editingDescr,
      purchased: editingPurchased
    }
  }

  const handleSubmit = () => {
    if (!editingName.trim().length) {
      setCurrentError('Name cannot be blank');
      return;
    }
    if (editingName.trim().length > MAX_NAME_LENGTH) {
      setCurrentError('Name cannot be > ' + MAX_NAME_LENGTH + ' characters');
      return;
    }
    if (editingDescr.trim().length > MAX_DESCR_LENGTH) {
      setCurrentError('Description cannot be > ' + MAX_DESCR_LENGTH + ' characters');
      return;
    }
    if (editingQty < 1) {
      setCurrentError('Quantity must be > 0');
      return;
    }
    const toSave = generateObjectFromCurrentValues();
    fetch('/api/items/put', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toSave)
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
                  <h4>{formTitle}</h4>
                  <div>{formSubtitle}</div>
                </div>
                <FormControl fullWidth required>
                  <TextField
                    required
                    label="Item Name"
                    placeholder="Item Name"
                    value={editingName}
                    onChange={(event) => {
                      const toSet = generateObjectFromCurrentValues();
                      toSet.name = event.target.value;
                      dispatch(setEditableItem(toSet));
                    }}
                  />
                </FormControl>
                <FormControl fullWidth >
                  <TextField
                    label="Description"
                    placeholder="Description"
                    value={editingDescr}
                    onChange={(event) => {
                      const toSet = generateObjectFromCurrentValues();
                      toSet.description = event.target.value;
                      dispatch(setEditableItem(toSet));
                    }}
                    rows={4}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel >How many?</InputLabel>
                  <Select
                    id="quantity-required"
                    value={editingQty}
                    placeholder="How many?"
                    label="How many?"
                    sx={{
                      padding: "8px",
                      marginTop: "10px"
                    
                    }}
                    onChange={(event) => {
                      const toSet = generateObjectFromCurrentValues();
                      toSet.quantity = event.target.value;
                      dispatch(setEditableItem(toSet));
                    }}
                  >
                    {quantityOptions}
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
                {inEditMode ? (
                  <FormControlLabel control={(<Checkbox checked={editingPurchased} onChange={(event) => {
                    const toSet = generateObjectFromCurrentValues();
                    toSet.purchased = event.target.checked;
                    dispatch(setEditableItem(toSet));
                  }}/>)} label="Purchased" />
                ) : (
                  ""
                )}
              </div>
              <div className="error">{currentError}</div>
            </Box>
          </DialogContent>
          <DialogActions>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{formButtonLabel}</Button>
        </DialogActions>
        </Dialog>
    </div>
  )
}

export default AddOrEditItem;
