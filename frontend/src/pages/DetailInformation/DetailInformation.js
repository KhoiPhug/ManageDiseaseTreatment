import classNames from 'classnames/bind';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
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
import * as drugbookService from '@/services/drugbookService';

import ExamTab from './TabDetail/ExamTab';
import ResultTab from './TabDetail/ResultTab';
import UltrasoundResultTab from './TabDetail/UltrasoundResultTab';
import PrescriptionTab from './TabDetail/PrescriptionTab';

import styles from './DetailInformation.module.scss';

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
    drugbookID: 0,
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

function DetailInformation() {
    const location = useLocation();
    const specForm = location.state;

    const [exam, setExam] = useState(emptyExam);
    const [overResult, setOverResult] = useState(specForm.overResult);
    const [ultrasoundResult, setUltrasoundResult] = useState(emptyUltrasoundResult);
    const [prescription, setPrescription] = useState(emptyPrescription);
    const [bills, setBills] = useState([]);
    const [dataChange, setDataChange] = useState(false);

    // console.log(specForm);

    useEffect(() => {
        examService.getExamBySpecFormId(specForm.specFormId).then((exam) => {
            let _exam = { ...exam };
            // console.log(exam._id);
            if (_exam._id) {
                setExam(_exam);
            }
        });
        ultrasoundResultService.getUltrasoundResultBySpecFormId(specForm.specFormId).then((data) => {
            let _ultrasoundResult = { ...data };
            if (_ultrasoundResult._id) {
                setUltrasoundResult(_ultrasoundResult);
            }
        });
        drugbookService.getDrugBookList().then((data) => {
            setBills(data);
            console.log(data);
        });
        prescriptionService.getPrescriptionByFormId(specForm.formId).then((data) => {
            let _prescription = { ...data };
            if (_prescription._id) {
                setPrescription(_prescription);
            }
        });
    }, [dataChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const dataTab = [
        {
            id: 'tab1',
            title: 'Exam',
            content: (
                <ExamTab
                    exam={exam}
                    setExam={setExam}
                    specFormId={specForm.specFormId}
                    setDataChange={setDataChange}
                    dataChange={dataChange}
                />
            ),
        },
        {
            id: 'tab2',
            title: 'Result',
            content: <ResultTab overResult={overResult} _id={specForm._id} setOverResult={setOverResult} />,
        },
        {
            id: 'tab3',
            title: 'Ultrasound result',
            content: (
                <UltrasoundResultTab
                    ultrasoundResult={ultrasoundResult}
                    setUltrasoundResult={setUltrasoundResult}
                    specFormId={specForm.specFormId}
                    setDataChange={setDataChange}
                    dataChange={dataChange}
                />
            ),
        },
        {
            id: 'tab4',
            title: 'Prescription',
            content: (
                <PrescriptionTab
                    bills={bills}
                    setBills={setBills}
                    prescription={prescription}
                    setPrescription={setPrescription}
                />
            ),
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link className={cx('btn-back')} to={config.routes.specialistChecklist}>
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </span>
                </Link>
                <h2 className={cx('header-title')}>Detail Information</h2>
            </div>

            <div className={cx('body')}>
                <div className={cx('info')}>
                    <div className={cx('info-form')}>
                        <p>{`ID Form: ${specForm.specFormId}`}</p>
                        <p>{`Date: ${specForm.dateStr}`}</p>
                    </div>
                    <div className={cx('info-form')}>
                        <p>{`Patient's Full Name: ${specForm.patientName}`}</p>
                        <p>{`Doctor's Full Name: ${specForm._person.name}`}</p>
                    </div>
                </div>

                <div>
                    <Tabs dataTab={dataTab}></Tabs>
                </div>
            </div>
        </div>
    );
}

export default DetailInformation;
