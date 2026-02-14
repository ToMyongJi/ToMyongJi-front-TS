import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/routers';
import queryClient from "@libs/query-client";
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(RouterProvider, { router: router }) }));
}
export default App;
