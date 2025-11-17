import { configureStore, combineReducers } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import sessions from './slices/sessionSlice';
import { persistStore, persistReducer, 
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken, setupAxiosInterceptors } from '../utils/api'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'sessions'],
};

const rootReducer = combineReducers({
  auth,
  sessions,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['register'], // avoids the error you saw
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

persistor.subscribe(() => {
  const s = persistor.getState() as any
  if (s && s.bootstrapped) {
    const state = store.getState() as any
    setAuthToken(state.auth?.token)
    setupAxiosInterceptors({
      getRefreshToken: () => (store.getState() as any).auth?.refreshToken || null,
      onTokens: (access, refresh) => {
        store.dispatch({ type: 'auth/loginSuccess', payload: { user: (store.getState() as any).auth.user, token: access, refreshToken: refresh || (store.getState() as any).auth.refreshToken } })
      }
    })
  }
})
