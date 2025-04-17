import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createContext, useState } from 'react';
import MainLayoutPage from './pages/MainLayoutPage/MainLayoutPage';

const MyContext = createContext();

function App() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);

    const router = createBrowserRouter([
        {
            path: '/',
            exact: true,
            element: (
                <>
                    <MainLayoutPage />
                </>
            ),
        },
    ]);

    const values = {
        isOpenSidebar,
        setIsOpenSidebar,
    };

    return (
        <>
            <MyContext.Provider value={values}>
                <RouterProvider router={router} />
            </MyContext.Provider>
        </>
    );
}

export default App;
export { MyContext };
