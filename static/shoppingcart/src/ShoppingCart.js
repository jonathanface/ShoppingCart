import React, {useEffect} from 'react';
import Empty from './sections/Landing/Empty';
import './css/main.css';
import AddOrEditItem from './sections/AddOrEditItem/AddOrEditItem';
import {getItems} from './store/ItemsSlice';
import {useSelector, useDispatch} from 'react-redux';
import ItemsList from './sections/ItemsList/ItemsList';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {setStandbyScreenVisibleState} from './store/StandbyScreenVisibleSlice';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector((state) => state.items);
  const standbyScreenVisible = useSelector((state) => state.standbyScreenVisible);

  useEffect(() => {
    if (loading === 'idle' && !items) {
      dispatch(getItems());
    } else if (loading === 'idle' && items) {
      dispatch(setStandbyScreenVisibleState(false));
    } else if (error) {
      console.error('ERROR occurred fetching items:', error);
    }
  }, [dispatch, loading, error, items]);

  return (
    <div>
      <header>SHOPPING LIST</header>
      <main>
        {items && items.length ? <ItemsList/> : <Empty/>}
        <AddOrEditItem/>
      </main>
      <Backdrop
        sx={{color: '#4C80B6', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={standbyScreenVisible.value}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ShoppingCart;
