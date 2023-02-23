import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        // [counterApi.reducerPath]: counterApi.reducer,
    },
    // Add the generated middleware to the store
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(counterApi.middleware),
});
