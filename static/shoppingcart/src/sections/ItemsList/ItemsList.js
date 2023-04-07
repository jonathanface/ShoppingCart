import React, {useState, useMemo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { flipAddingItemState } from '../../store/AddingItemSlice';
import '../../css/list.css';
import { getItems } from '../../store/ItemsSlice'

const ItemsList = () => {
    const [checked, setChecked] = useState([]);
    const { items, loading, error } = useSelector((state) => state.items);
    const dispatch = useDispatch();

    useEffect(() => {
        checked.forEach(item => {
            console.log(item)
        });
    }, [checked]);

    const handleToggle = (labelId) => () => {
        const currentIndex = checked.indexOf(labelId);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(labelId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleDelete = (id) => {
        const params = {}
        params.id = id;
        fetch('/api/items', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([params])
          }).then((response) => {
            if (response.ok) {
                dispatch(getItems());
            }
          });
    }

    const handleEdit = (id) => {
        console.log("edit", id)
    }

    const elements = items.map((item, index) => {
        const labelId = 'checkbox-list-label-' + index;
        const checkedClass =  checked.indexOf(labelId) > -1 ? "checked-item" : ""
        const nameLabelColor = checked.indexOf(labelId) > -1 ? "#1976d2" : "#333"
        return (
            <ListItem key={item.id} className={checkedClass}
                sx={{
                    border: '1px solid lightgray;',
                    borderBottom: 0,
                    '&:last-child': {
                        border: '1px solid lightgray;'
                    }
                }}
                secondaryAction={
                    <div>
                        <IconButton key={item.id + "_editBtn"} edge="end" aria-label="edit" onClick={()=>{handleEdit(item.id)}}>
                            <EditIcon />
                        </IconButton>
                        <IconButton key={item.id + "_deleteBtn"}edge="end" aria-label="delete" onClick={()=>{handleDelete(item.id)}}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                }
                quantity={item.quantity}>
                <ListItemButton role={undefined} onClick={handleToggle(labelId)} sx={{
                    maxWidth: '50px',
                    paddingRight: '0 !important'
                }}>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={checked.indexOf(labelId) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                </ListItemButton>
                <ListItemText
                    disableTypography
                    primary={<Typography variant="body2" style={{ color: nameLabelColor, fontSize:'1rem' }}>{item.name}</Typography>}
                    secondary={<Typography variant="body2" style={{ color: 'gray', fontSize:'0.8rem' }}>{item.description}</Typography>}
                />
            </ListItem>
        );
    });

    return (
        <div className="shopping-list">
            <header>
                <h4>Your Items</h4>
                <Button variant="contained" onClick={()=>{
                    dispatch(flipAddingItemState());
                }} sx={{
                    float:'right',
                    marginTop:'15px',
                    fontSize:'12px',
                }}>Add Item</Button>
            </header>
            <List>{elements}
            </List>
        </div>
    );
}

export default ItemsList
