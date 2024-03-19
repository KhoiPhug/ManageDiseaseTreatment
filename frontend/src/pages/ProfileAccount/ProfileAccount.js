import classNames from 'classnames/bind';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Image } from 'primereact/image';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAnglesLeft, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

import '@/pages/ManagerAccount/index.css';
import '@/pages/ManagerAccount/DataTableDemo.css';
import config from '@/config';
import ButtonComponent from '@/components/Button';
import { SearchIcon, TrashSmallIcon, MedicalResultIcon, PencilSmallIcon } from '@/components/Icons';
import FirstItem from '@/components/Tabs/FirstItem';
import SecondItem from '@/components/Tabs/SecondItem';
import Tabs from '@/components/Tabs';

import * as meformService from '@/services/meformService';
import * as specFormService from '@/services/specformService';
import * as examService from '@/services/examService';
import * as ultrasoundResultService from '@/services/ultrasoundResultService';
import * as billService from '@/services/billService';
import * as prescriptionService from '@/services/prescriptionService';
import * as personService from '@/services/personService';

import styles from './ProfileAccount.module.scss';

const cx = classNames.bind(styles);

const emptyExam = {
    temperature: 0,
    sysBloodPressure: 0, // <120
    diasBloodPressure: 0, // <80
    breathing: 0,
    pulse: 0,
    height: 0,
    weight: 0,
    note: '',
};

const emptyUltrasoundResult = {
    specFormId: '',
    result: '',
    conclusion: '',
    images: [],
};

let emptyBill = {
    billID: 0,
    drugname: null,
    unit: null,
    unitprice: null,
    quantity: 0,
    amount: 0,
    //status: null,
    total: 0,
    //inventoryStatus: 'INSTOCK',
};

let emptyPrescription = {
    prescriptionId: '',
    formId: 0,
    patientId: 0,
    status: false,
    total: 0,
    drugIds: [1],
};

let emptyPerson = {
    accountId: 0,
    name: '',
    address: '',
    dayOfBirth: new Date(Date.now()),
    avatar: '',
    gender: '',
    job: '',
    phone: '',
};

function ProfileAccount() {
    const token = JSON.parse(localStorage.getItem('token'));
    const accountCurrent = token.account._doc;
    const [isLogin, setIsLogin] = useState(true);

    const [person, setPerson] = useState(emptyPerson);
    const [dataChange, setDataChange] = useState(false);
    const gender = ['Female', 'Male'];
    const toast = useRef(null);

    useLayoutEffect(() => {
        console.log('truoc', accountCurrent);
        personService.getCurrentPersonByAccountId(accountCurrent.ID).then((data) => {
            let _person = { ...data };
            _person.dayOfBirth = new Date(data.dayOfBirth);
            console.log(_person);
            setPerson(_person);
        });
    }, [dataChange]);

    const onDateChange = (e) => {
        let _person = { ...person };
        _person.dayOfBirth = e.value;
        setPerson(_person);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        // let _specForm = { ...meform };
        let _person = { ...person };
        _person[`${name}`] = val;
        setPerson(_person);
        // setMeform(_meform);
    };

    const onPersonChange = (e) => {
        let _person = { ...person };
        _person.gender = e.value;
        setPerson(_person);
        // setSelectedPerson(e.value);
        // console.log(_meform);
    };

    const handlerUpdate = () => {
        let _person = { ...person };
        console.log(_person);
        personService.updatePerson(_person, _person._id).then(() => {
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Person Updated',
                life: 3000,
            });
            setDataChange(!dataChange);
        });
    };

    return (
        <div className={cx('wrapper')}>
            <Toast ref={toast} />
            <div className={cx('header')}>
                <Link className={cx('btn-back')} to={config.routes.home}>
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </span>
                </Link>
                <h2 className={cx('header-title')}>Profile</h2>
            </div>

            <div className={cx('body')}>
                <div className={cx('card', 'flex', 'justify-content-center', 'avatar-account')}>
                    <Image
                        src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg"
                        alt="Image"
                        width="250"
                        preview
                    />
                </div>
                <div className={cx('info-person')}>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="patientId" className={cx('label-input')}>
                                Full name
                            </label>
                            <InputText
                                id="patientId"
                                value={person.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                // className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {/* {submitted && !meform.patientId && <small className="p-error">Name is required.</small>} */}
                        </div>
                        <div className="field col">
                            <label htmlFor="patientName">Address</label>
                            <InputText
                                id="patientName"
                                value={person.address}
                                onChange={(e) => onInputChange(e, 'address')}
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                // className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="personName" className={cx('label-input')}>
                                Gender
                            </label>

                            <Dropdown
                                className={cx('dialog-dropdown')}
                                value={person.gender}
                                // value={meform.personId === 0 ? selectedPerson : meform._person}
                                options={gender}
                                onChange={onPersonChange}
                                // optionLabel="name"
                                // placeholder={'Select a doctor'}
                                // disabled = {meform.formId === 0 ? false : true}
                            />
                            {/* {submitted && !meform.personId && <small className="p-error">Name is required.</small>} */}
                        </div>
                        <div className="field col">
                            <label htmlFor="patientPhone">Phone number</label>
                            <InputText
                                id="patientPhone"
                                value={person.phone}
                                onChange={(e) => onInputChange(e, 'phone')}
                                // required
                                // autoFocus
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                // className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="patientJob">Job</label>
                            <InputText
                                id="patientJob"
                                value={person.job}
                                // onChange={(e) => onInputChange(e, 'job')}
                                disabled
                                // required
                                // autoFocus
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                // className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                        </div>
                        <div className="field col">
                            <label htmlFor="date">Date of birth</label>

                            <Calendar id="icon" value={person.dayOfBirth} onChange={(e) => onDateChange(e)} showIcon />

                            {/* <InputText
                                    id="date"
                                    value={meform.date}
                                    onChange={(e) => onInputChange(e, 'date')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                /> */}
                            {/* {submitted && !meform.patientId && <small className="p-error">Name is required.</small>} */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Toast ref={toast} /> */}
            <div className={cx('btn-group')}>
                <ButtonComponent
                    className={cx('btn-update')}
                    primary
                    large
                    // leftIcon={<TrashSmallIcon width="1.6rem" height="1.6rem" />}
                    onClick={handlerUpdate}
                    // disable={!selectedProducts || !selectedProducts.length}
                >
                    Update
                </ButtonComponent>
            </div>
        </div>
    );
}

export default ProfileAccount;
