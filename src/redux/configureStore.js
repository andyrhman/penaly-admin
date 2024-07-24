import { SetUserReducer } from './reducers/setUserReducer';
import { configureStore } from '@reduxjs/toolkit';

export const configStore = () => {
    return configureStore({
        reducer: {
            user: SetUserReducer
        }
    });
}