import React, {useEffect} from 'react';
import Empty from './sections/Landing/Empty'
import './css/main.css';

const ShoppingCart = () => {

    useEffect(() => {
    }, []);

    return (
        <div>
            <header>SHOPPING LIST</header>
            <main>
                <Empty/>
            </main>
            
        </div>
    )
}

export default ShoppingCart;
