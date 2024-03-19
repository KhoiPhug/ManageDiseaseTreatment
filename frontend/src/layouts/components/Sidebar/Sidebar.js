import classNames from 'classnames/bind';
// import { useState, useEffect } from 'react';

import config from '@/config';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
    ManageAccountIcon,
    ManageAccountActiveIcon,
    ManageBillIcon,
    ManageBillActiveIcon,
    DrugIcon,
    DrugActiveIcon,
} from '@/components/Icons';
import Menu, { MenuItem } from './Menu';
// import SuggestedAccounts from '@/components/SuggestedAccounts';
// import * as userService from '@/services/userService';
import styles from './Sidebar.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

// const PER_PAGE = 5;

function Sidebar({ currentAccount }) {
    // const [SuggestedUsers, setSuggestedUser] = useState([]);
    const [managerAccount, setManagerAccount] = useState(false);
    const [medicalChecklist, setMedicalChecklist] = useState(false);
    const [specialistChecklist, setSpecialistChecklist] = useState(false);
    const [manageBill, setManageBill] = useState(false);
    const [manageDrugBook, setManageDrugBook] = useState(false);
    const [report, setReport] = useState(false);
    useEffect(() => {
        if (currentAccount) {
            const job = currentAccount.job;
            switch (job) {
                case 'Specialist doctor':
                    setSpecialistChecklist(true);
                    break;
                case 'General doctor':
                    setMedicalChecklist(true);
                    break;
                case 'Pharmacist':
                    setManageDrugBook(true);
                    break;
                case 'Staff':
                    setMedicalChecklist(true);
                    break;
                case 'Manager':
                    setManagerAccount(true);
                    setReport(true);
                    break;
                default:
                    break;
            }
        }
        console.log('sidebar', currentAccount);
    }, []);

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                {/* <MenuItem title="For You" to={config.routes.home} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
                <MenuItem
                    title="Following"
                    to={config.routes.following}
                    icon={<UserGroupIcon />}
                    activeIcon={<UserGroupActiveIcon />}
                /> */}
                {managerAccount && (
                    <MenuItem
                        title="Manager Account"
                        to={config.routes.managerAccount}
                        icon={<ManageAccountIcon />}
                        activeIcon={<ManageAccountActiveIcon />}
                    />
                )}
                {medicalChecklist && (
                    <MenuItem
                        title="Manager Checklist"
                        to={config.routes.medicalChecklist}
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
                    />
                )}
                {specialistChecklist && (
                    <MenuItem
                        title="Specialist Checklist"
                        to={config.routes.specialistChecklist}
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
                    />
                )}
                {manageBill && (
                    <MenuItem
                        title="Manage Bill"
                        to={config.routes.manageBill}
                        icon={<ManageBillIcon />}
                        activeIcon={<ManageBillActiveIcon />}
                    />
                )}
                {manageDrugBook && (
                    <MenuItem
                        title="Manage Drug"
                        to={config.routes.manageDrugBook}
                        icon={<DrugIcon />}
                        activeIcon={<DrugActiveIcon />}
                    />
                )}

                {report && (
                    <MenuItem
                        title="Return-Report"
                        to={config.routes.report}
                        icon={<LiveIcon />}
                        activeIcon={<LiveActiveIcon />}
                    />
                )}
            </Menu>
            {/* <SuggestedAccounts label="Suggested accounts" data={SuggestedUsers} />
            <SuggestedAccounts label="Following accounts" /> */}
        </aside>
    );
}

export default Sidebar;
