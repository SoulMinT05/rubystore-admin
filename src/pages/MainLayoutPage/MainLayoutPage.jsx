import React, { useContext } from 'react';
import { MyContext } from '../../App';

import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponent/SidebarComponent';
import DashboardPage from '../DashboardPage/DashboardPage';
import { Outlet } from 'react-router-dom';
import ScrollToTopComponent from '../../components/ScrollToTopComponent/ScrollToTopComponent';

const MainLayoutPage = () => {
    const context = useContext(MyContext);
    return (
        <section className="main">
            <ScrollToTopComponent />

            <HeaderComponent />
            <div className="contentMain flex">
                <div
                    className={`overflow-hidden sideWrapper transition-all ${
                        context.isOpenSidebar ? 'w-[18%]' : 'w-0 opacity-0'
                    }`}
                >
                    <SidebarComponent />
                </div>
                <div
                    className={`contentRight px-5 py-4 transition-all ${
                        context.isOpenSidebar ? 'w-[82%]' : 'w-[100%]'
                    }`}
                >
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default MainLayoutPage;
