import React from "react";
import Button from '@mui/material/Button';
import '../../css/empty.css';

const Empty = () => {

    return (
        <div className={"empty-container"}>
            <div>Your shopping list is empty :(</div>
            <div>
                <Button variant="contained">Add your first item</Button>
            </div>
        </div>
    )

}

export default Empty;
