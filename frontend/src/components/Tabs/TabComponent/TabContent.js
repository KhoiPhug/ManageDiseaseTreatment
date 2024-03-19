import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../Tabs.module.scss';
 
const cx = classNames.bind(styles);

const TabContent = ({id, activeTab, children}) => {
 return (
   activeTab === id ? <div className={cx('TabContent')}>
     { children }
   </div>
   : null
 );
};

TabContent.prototype = {
    id: PropTypes.string,
    activeTab: PropTypes.string,
    children: PropTypes.node,
}
 
export default TabContent;
