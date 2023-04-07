import React from "react";
import Button from '@mui/material/Button';
import '../../css/empty.css';
import {useDispatch} from 'react-redux';
import { setAddingOrEditingItemState } from "../../store/AddingOrEditingItemSlice";
import { setInEditMode } from "../../store/EditableItemSlice";

const Empty = () => {

    const dispatch = useDispatch();

    return (
        <div className={"empty-container"}>
            <div>Your shopping list is empty :(</div>
            <div>
                <Button variant="contained" onClick={()=>{
                    dispatch(setInEditMode(false));
                    dispatch(setAddingOrEditingItemState(true));
                }}>Add your first item</Button>
            </div>
        </div>
    )

}

export default Empty;
