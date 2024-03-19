import { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../Tabs.module.scss';

const cx = classNames.bind(styles);

function TabNavItem({ id, title, activeTab, setInfoTab }) {
  const liRef = useRef()

    const handleClick = () => {
      const {offsetLeft , offsetWidth} = liRef.current;
      const infoTab = {
        activeTab: id,
        offsetLeft: `${offsetLeft}px`,
        offsetWidth: `${offsetWidth}px`,
      }
      setInfoTab(infoTab);
    };

    return ( 
        <li key={id} ref={liRef} onClick={handleClick} className={cx((activeTab === id ? 'active' : ''))}>
        { title }
      </li>
    );
}

TabNavItem.prototype = {
    id: PropTypes.string,
    title: PropTypes.string,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func,
}

export default TabNavItem;