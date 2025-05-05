import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Mặc định dùng localStorage
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticketSlice';
import employeeReducer from './slices/employeeSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer, ticketReducer, employeeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    tickets: ticketReducer,
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);