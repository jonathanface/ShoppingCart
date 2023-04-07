import React, {useEffect} from 'react';
import Empty from './sections/Landing/Empty'
import './css/main.css';
import AddOrEditItem from './sections/AddOrEditItem/AddOrEditItem';
import { getItems } from './store/ItemsSlice'
import {useSelector, useDispatch} from 'react-redux';
import ItemsList from './sections/ItemsList/ItemsList'

const ShoppingCart = () => {

    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.items)

    useEffect(() => {
        dispatch(getItems())
    }, [dispatch]);
    console.log("items", items, loading, error)
    return (
        <div>
            <header>SHOPPING LIST</header>
            <main>
            {items && items.length ? <ItemsList/> :  <div><Empty/><AddOrEditItem/></div>}
            </main>
            
        </div>
    )
}

export default ShoppingCart;
