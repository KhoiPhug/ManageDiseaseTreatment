// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '@/layouts/components/Header';
// import useToken from '@/hooks/useToken';
import { useLayoutEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
// import Sidebar from '@/layouts/components/Sidebar';
import styles from './HeaderOnly.module.scss';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
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
            {!token && (
                <div>
                    <Navigate to="/login" replace={true} />
                </div>
            )}
            {token && (
                <div className={cx('wrapper')}>
                    <Header />
                    <div className={cx('container')}>
                        <div className={cx('content')}>{children}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeaderOnly;
