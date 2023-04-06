import React from "react";
import Button from '@mui/material/Button';
import '../../css/empty.css';
import {useDispatch} from 'react-redux';
import { flipAddingItemState } from "../../store/AddingItemSlice";

const Empty = () => {

    const dispatch = useDispatch();

    return (
        <div className={"empty-container"}>
            <div>Your shopping list is empty :(</div>
            <div>
                <Button variant="contained" onClick={()=>{
                    dispatch(flipAddingItemState());
                }}>Add your first item</Button>
            </div>
        </div>
    )

}

export default Empty;
