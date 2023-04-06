import React, {useEffect} from 'react';
import Empty from './sections/Landing/Empty'
import './css/main.css';
import AddItem from './sections/AddItem/AddItem';

const ShoppingCart = () => {

    useEffect(() => {
    }, []);

    return (
        <div>
            <header>SHOPPING LIST</header>
            <main>
                <Empty/>
                <AddItem />
            </main>
            
        </div>
    )
}

export default ShoppingCart;
