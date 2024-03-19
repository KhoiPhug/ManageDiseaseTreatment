import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '@/routes/routes';
import DefaultLayout from '@/layouts';
import useToken from './hooks/useToken';
import Login from './pages/Login';

function App() {
    // const { token, setToken } = useToken();
    const token = JSON.parse(localStorage.getItem('token'));

    useLayoutEffect(() => {
        console.log('truoc', token);
    }, []);

    // if (!token) {
    //     return <Login />;
    // }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        if (token && route.layout === null) {
                            Layout = Fragment;
                            return <Route key={index} path={route.path} element={<Page />} />;
                        } else {
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        }
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
