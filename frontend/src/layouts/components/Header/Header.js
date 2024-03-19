import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsisVertical,
    faEarthAsia,
    faCircleQuestion,
    faKeyboard,
    faUser,
    faCoins,
    faGear,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

import Button from '@/components/Button';
import images from '@/assets/images';
import Menu from '@/components/Popper/Menu';
import { MessagesIcon, PlusIcon, InboxIcon } from '@/components/Icons/Icons';
import config from '@/config';
import Image from '@/components/Image';
// import useToken from '@/hooks/useToken';
import styles from './Header.module.scss';
import { useEffect, useLayoutEffect, useState } from 'react';
// import Search from '../Search/Search';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];

function Header({ currentAccount }) {
    const currentUser = true;
    const [account, setAccount] = useState(null);

    // const {token} = useToken();

    // useLayoutEffect(() => {
    //     setAccount(token.account._doc)
    //     console.log(account);
    // },[])

    //Handle logic
    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View Profile',
            to: '/profileAccount',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/login',
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <Link to={config.routes.home} className={cx('logo-link')}>
                        <img src={images.logoFami} alt="Tiktok" />
                    </Link>
                </div>

                {/* <Search /> */}

                <div className={cx('action')}>
                    {/* {currentUser ? (
                        <>
                            <Button primary leftIcon={<PlusIcon width="2rem" height="2rem" />}>
                                Upload
                            </Button>
                            <Tippy delay={[0, 50]} content="Messages" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessagesIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                    <span className={cx('badge')}>12</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button text>Upload</Button>
                            <Button primary>Login</Button>
                        </>
                    )} */}
                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {currentUser ? (
                            <div className={cx('avatar-group')}>
                                <p>{currentAccount ? currentAccount.fullname : ''}</p>
                                <Image
                                    className={cx('user-avatar')}
                                    src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/323885182_533273118553389_7645687866019652672_n.jpg?stp=dst-jpg_p600x600&_nc_cat=110&ccb=1-7&_nc_sid=e3f864&_nc_ohc=1dOoUgF3v8wAX_gVZ23&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfDeRMzvR9NxQjgeykgWUqe2-ZYgJ4D-DlmfteYkS3omfQ&oe=63C00610"
                                    alt="Nguyen Van A"
                                />
                            </div>
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
