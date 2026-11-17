import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from './redux/userSlice';
import type { StoreDispatch } from './redux/store';
const AppInit = () => {
  const dispatch = useDispatch<StoreDispatch>();
  useEffect(() => { void dispatch(restoreSession()); }, [dispatch]);
  return null;
};
export default AppInit;
