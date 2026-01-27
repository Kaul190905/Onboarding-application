import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
    title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ title }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar title={title} />
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};


