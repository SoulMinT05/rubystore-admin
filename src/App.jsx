import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import SidebarComponent from './components/SidebarComponent/SidebarComponent';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            exact: true,
            element: (
                <>
                    <section className="main">
                        <HeaderComponent />
                        <div className="contentMain flex">
                            <div className="sideWrapper w-[18%]">
                                <SidebarComponent />
                            </div>
                        </div>
                    </section>
                </>
            ),
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
