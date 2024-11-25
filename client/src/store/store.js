import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "../auth/authSlice";
import { carouselApi } from "../api/carouselApiSlice";
import { roleApi } from "../api/roleApiSlice.js";
import { userApi } from "../api/userApiSlice.js";
import  storage from 'redux-persist/lib/storage'
import { settingsApi } from "../api/settingsApiSlice.js";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [carouselApi.reducerPath]: carouselApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      roleApi.middleware,
      carouselApi.middleware,
      settingsApi.middleware,
    ),
});

export const persistor = persistStore(store)
setupListeners(store.dispatch);