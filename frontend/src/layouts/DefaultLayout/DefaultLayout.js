import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '@/layouts/components/Header';
import Sidebar from '@/layouts/components/Sidebar';
import styles from './DefaultLayout.module.scss';
// import useToken from '@/hooks/useToken';
import { useLayoutEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const token = JSON.parse(localStorage.getItem('token'));
    const [isLogin, setIsLogin] = useState(true);
    useLayoutEffect(() => {
        console.log('truoc', token.account._doc);
    }, []);
    // const { token } = useToken();
    // useLayoutEffect(() => {
    //     if(token){
    //         setIsLogin(true);
    //     }
    //     else{
    //         setIsLogin(false);
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    return (
        <div>
            {!token && <Navigate to="/login" replace={true} />}
            {token && (
                <div className={cx('wrapper')}>
                    <Header currentAccount={token.account._doc} />
                    <div className={cx('container')}>
                        <Sidebar currentAccount={token.account._doc} />
                        <div className={cx('content')}>{children}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

DefaultLayout.prototype = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
