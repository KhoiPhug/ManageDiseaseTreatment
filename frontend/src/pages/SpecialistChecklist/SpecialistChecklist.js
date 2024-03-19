import classNames from 'classnames/bind';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

import '@/pages/ManagerAccount/index.css';
import '@/pages/ManagerAccount/DataTableDemo.css';
import config from '@/config';
import MyBtn from '@/components/Button';
import { SearchIcon, TrashSmallIcon, MedicalResultIcon, PencilSmallIcon } from '@/components/Icons';
import * as meformService from '@/services/meformService';
import * as specFormService from '@/services/specformService';
import * as personService from '@/services/personService';
import styles from './SpecialistChecklist.module.scss';

const cx = classNames.bind(styles);

function SpecialistChecklist() {
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK',
    };

    let emptyMEForm = {
        formId: 0,
        numOrder: 0,
        personId: 0,
        patientId: 0,
        reason: 'Benh',
        date: new Date(Date.now()),
        roomIds: [],
        _patient: {
            patientId: 0,
            name: '',
            address: '',
            phone: '',
            career: '',
            age: 0,
        },
        _person: {
            _id: '',
            personId: 0,
            name: '',
        },
    };

    let emptySpecForm = {
        specFormId: 0,
        formId: 0,
        roomId: 0,
        personId: 0,
        patientId: 0,
        request: '',
        overResult: '',
        date: new Date(Date.now()),
        numOrder: 0,
        reason: '',
        roomIds: [],
        _patient: {
            patientId: 0,
            name: '',
            address: '',
            phone: '',
            career: '',
            age: 0,
        },
        _person: {
            _id: '',
            personId: 0,
            name: '',
        },
    };

    const emptyCounter = {
        mEFormSeq: 0,
        patientSeq: 0,
    };
    const [specForms, setSpecForms] = useState(null);
    const [specForm, setSpecForm] = useState(emptySpecForm);

    // const [meforms, setMeforms] = useState(null);
    // const [meform, setMeform] = useState(emptyMEForm);
    const [changeData, setChangeData] = useState(false);
    const [counterMEForm, setCounterMEForm] = useState(emptyCounter);
    const [persons, setPersons] = useState(null);
    // const [roomsSelected, setRoomsSelected] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);
    // const [isAddRoom, setIsAddRoom] = useState(false);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        specFormService.getSpecFormList().then((data) => {
            let newSpecForms = data.map((item) => {
                let newItem = { ...item };
                newItem.specFormId = item.specFormId.toLocaleString();
                newItem.patientId = item.patientId.toLocaleString();
                newItem.dateStr = new Date(item.date).toLocaleDateString('us-US');
                newItem.date = new Date(item.date);
                return newItem;
            });
            setSpecForms(newSpecForms);
        });

        meformService.getCounterMEForm().then((data) => {
            const _counterMEForm = {
                mEFormSeq: data.mEForm.seq + 1,
                patientSeq: data.patient.seq + 1,
            };

            setCounterMEForm(_counterMEForm);
        });

        meformService.getRoomsToForm().then((data) => {
            let _roomOptions = [...data, { name: 'All room', roomId: -1 }];

            setRooms(_roomOptions);
        });

        personService.getListToSpecForm().then((data) => {
            setPersons(data);
        });
    }, [changeData]); // eslint-disable-line react-hooks/exhaustive-deps

    const onRoomChange = (e) => {
        let _room = e.value;
        setRoom(_room);
        if (_room.roomId > 0) {
            setGlobalFilter(`r${_room.roomId}`);
        } else {
            setGlobalFilter('');
        }
    };

    const onPersonChange = (e) => {
        let _specForm = { ...specForm };
        _specForm.personId = e.value.personId;
        _specForm._person = e.value;
        setSpecForm(_specForm);
        // setMeform(_meform);
        // setSelectedPerson(e.value);
        // console.log(_meform);
    };

    const openNew = () => {
        setSpecForm(emptySpecForm);
        // setRoomsSelected([]);

        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveMEForm = () => {
        setSubmitted(true);

        // let _meform = { ...meform };
        let _specForm = { ...specForm };

        if (specForm._id) {
            // console.log('data', _specForm);

            specFormService.updateSpecForm(_specForm, _specForm._id).then((data) => {
                // console.log(data);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Form Created',
                    life: 3000,
                });

                setProductDialog(false);
                setSpecForm(emptySpecForm);
                // setMeform(emptyMEForm);
                setChangeData(!changeData);
            });
        } else {
            // console.log('data',_specForm);
            // _meform.patientId = counterMEForm.patientSeq;
            // meformService.createMEForm(_meform).then((data) => {
            //     toast.current.show({
            //         severity: 'success',
            //         summary: 'Successful',
            //         detail: 'Product Created',
            //         life: 3000,
            //     });
            //     setProductDialog(false);
            //     setMeform(emptyMEForm);
            //     setChangeData(!changeData);
            // });
        }
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveMEForm} />
        </React.Fragment>
    );

    const onInputChange = (e, name, type = 'form') => {
        const val = (e.target && e.target.value) || '';
        // let _specForm = { ...meform };
        let _specForm = { ...specForm };

        switch (type) {
            case 'form': {
                // console.log(val);
                _specForm[`${name}`] = val;
                break;
            }
            case 'patient':
                _specForm._patient[`${name}`] = val;
                break;
            case 'person':
                _specForm._person[`${name}`] = val;
                break;
            default:
                break;
        }

        setSpecForm(_specForm);
        // setMeform(_meform);
    };

    const onDateChange = (e) => {
        let _specForm = { ...specForm };
        _specForm.date = e.value;
        // setMeform(_meform);

        setSpecForm(_specForm);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
        setChangeData(!changeData);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const deleteProduct = () => {
        // let _meform = { ...meform };
        let _specForm = { ...specForm };
        specFormService.deleteSpecForm(_specForm._id).then((data) => {
            setChangeData(!changeData);
            setDeleteProductDialog(false);
            setSpecForm(emptySpecForm);
            // setMeform(emptyMEForm);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Form Deleted', life: 3000 });
        });
    };

    const deleteSelectedProducts = () => {
        let _selectedProducts = [...selectedProducts];
        let specFormIds = [];

        _selectedProducts.forEach((item) => {
            specFormIds.push(item._id);
        });

        specFormService.deleteSelectedSpecForm(specFormIds).then((data) => {
            setChangeData(!changeData);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        });
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const DataTableCrudDemo = () => {
        const editProduct = (e, specForm) => {
            setSpecForm({ ...specForm });
            setProductDialog(true);
            e.stopPropagation();
        };

        const confirmDeleteProduct = (e, specForm) => {
            setSpecForm(specForm);
            setDeleteProductDialog(true);
            e.stopPropagation();
        };

        const actionBodyTemplate = (rowData) => {
            return (
                <div className={cx('actionBtns', 'spec-form')}>
                    {rowData._person && (
                        <Link className={cx('btn-delete')} to={`/detailInformation/${rowData._id}`} state={rowData}>
                            <span className={cx('icon')}>
                                <MedicalResultIcon />
                            </span>
                        </Link>
                    )}
                    <button className={cx('btn-delete')} onClick={(e) => editProduct(e, rowData)}>
                        <span className={cx('icon')}>
                            <PencilSmallIcon />
                        </span>
                    </button>
                    {/* <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-success mr-2"
                        onClick={() => editProduct(rowData)}
                    /> */}
                    <button className={cx('btn-delete')} onClick={(e) => confirmDeleteProduct(e, rowData)}>
                        <span className={cx('icon')}>
                            <TrashSmallIcon />
                        </span>
                    </button>
                </div>
            );
        };

        return (
            <div className="">
                <div className="card">
                    {/* Datatable */}
                    <DataTable
                        ref={dt}
                        value={specForms}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} forms"
                        globalFilter={globalFilter}
                        responsiveLayout="scroll"
                    >
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            selectionMode="multiple"
                            headerStyle={{ width: '3rem' }}
                            exportable={false}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="specFormId"
                            header="ID"
                            sortable
                            style={{ minWidth: '12rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="patientId"
                            header="ID Patient"
                            sortable
                            style={{ minWidth: '16rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="patientName"
                            header="Patient's Name"
                            // body={priceBodyTemplate}
                            sortable
                            style={{ minWidth: '8rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="patientPhone"
                            header="Phone"
                            // body={priceBodyTemplate}
                            sortable
                            style={{ minWidth: '8rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="dateStr"
                            header="Date"
                            sortable
                            style={{ minWidth: '10rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ minWidth: '8rem' }}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    };

    return (
        <div className={cx('wrapper')}>
            <Toast ref={toast} />
            <h2 className={cx('header-title')}>Specialist Checklist</h2>
            <div className={cx('body')}>
                <div className={cx('toolbar')}>
                    <div className={cx('search')}>
                        <span className={cx('search-icon')}>
                            <SearchIcon />
                        </span>
                        <InputText
                            className={cx('search-input')}
                            type="search"
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>
                    <div className={cx('btn-group')}>
                        {/* <MyBtn
                            className={cx('btn-add')}
                            primary
                            large
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={openNew}
                        >
                            New
                        </MyBtn> */}
                        {/* <Dropdown
                            className={cx('dialog-dropdown')}
                            value={room}
                            // value={meform.personId === 0 ? selectedPerson : meform._person}
                            options={rooms}
                            onChange={onRoomChange}
                            optionLabel="name"
                            placeholder={'Select a room to add'}
                            // disabled = {meform.formId === 0 ? false : true}
                        /> */}
                        <MyBtn
                            className={cx('btn-add')}
                            primary
                            large
                            leftIcon={<TrashSmallIcon width="1.6rem" height="1.6rem" />}
                            onClick={confirmDeleteSelected}
                            disable={!selectedProducts || !selectedProducts.length}
                        >
                            Delete
                        </MyBtn>
                    </div>
                </div>
                <DataTableCrudDemo />
            </div>

            {/* Product Details */}
            <Dialog
                visible={productDialog}
                style={{ width: '80%' }}
                header="Form Detail"
                headerClassName={cx('detail-dialog-header')}
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                <div className={cx('dialog')}>
                    <div>
                        <h1>Information of patient</h1>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="patientId" className={cx('label-input')}>
                                    Id Patient
                                </label>
                                <InputText
                                    id="patientId"
                                    value={specForm.specFormId === 0 ? counterMEForm.patientSeq : specForm.patientId}
                                    required
                                    disabled
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {submitted && !specForm.patientId && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="patientName">Full Name</label>
                                <InputText
                                    id="patientName"
                                    value={specForm._patient.name}
                                    onChange={(e) => onInputChange(e, 'name', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="patientAddress">Address</label>
                                <InputText
                                    id="patientAddress"
                                    value={specForm._patient.address}
                                    onChange={(e) => onInputChange(e, 'address', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                            <div className="field col">
                                <label htmlFor="patientPhone">Phone number</label>
                                <InputText
                                    id="patientPhone"
                                    value={specForm._patient.phone}
                                    onChange={(e) => onInputChange(e, 'phone', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="patientJob">Job</label>
                                <InputText
                                    id="patientJob"
                                    value={specForm._patient.career}
                                    onChange={(e) => onInputChange(e, 'career', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                            <div className="field col">
                                <label htmlFor="patientAge">Age</label>
                                <InputText
                                    id="patientAge"
                                    value={specForm._patient.age}
                                    onChange={(e) => onInputChange(e, 'age', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1>Information of patient</h1>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="formId" className={cx('label-input')}>
                                    Id Specialist Form
                                </label>
                                <InputText
                                    id="formId"
                                    value={specForm.specFormId === 0 ? counterMEForm.mEFormSeq : specForm.specFormId}
                                    required
                                    disabled
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {submitted && !specForm.specFormId && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="numOrder">Ordinal numbers</label>
                                <InputText
                                    id="numOrder"
                                    value={specForm.numOrder}
                                    onChange={(e) => onInputChange(e, 'numOrder')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {submitted && !specForm.numOrder && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="personName" className={cx('label-input')}>
                                    Full name of Doctor
                                </label>

                                <Dropdown
                                    className={cx('dialog-dropdown')}
                                    value={specForm._person}
                                    // value={meform.personId === 0 ? selectedPerson : meform._person}
                                    options={persons}
                                    onChange={onPersonChange}
                                    optionLabel="name"
                                    placeholder={'Select a doctor'}
                                    // disabled = {specForm.specFormId === 0 ? false : true}
                                />
                                {submitted && !specForm.personId && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                            <div className="field col">
                                <label htmlFor="date">Date</label>

                                <Calendar id="icon" value={specForm.date} onChange={(e) => onDateChange(e)} showIcon />

                                {/* <InputText
                                    id="date"
                                    value={meform.date}
                                    onChange={(e) => onInputChange(e, 'date')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                /> */}
                                {submitted && !specForm.patientId && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="reason">Reasons to see a doctor</label>
                        <InputTextarea
                            id="reason"
                            value={specForm.reason}
                            onChange={(e) => onInputChange(e, 'reason')}
                            required
                            rows={3}
                            cols={20}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="request">Request</label>
                        <InputTextarea
                            id="request"
                            value={specForm.request}
                            onChange={(e) => onInputChange(e, 'request')}
                            required
                            rows={3}
                            cols={20}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="overResult">Overview result</label>
                        <InputTextarea
                            id="overResult"
                            value={specForm.overResult}
                            onChange={(e) => onInputChange(e, 'overResult')}
                            required
                            rows={3}
                            cols={20}
                        />
                    </div>
                </div>
            </Dialog>
            {/* delete */}
            <Dialog
                visible={deleteProductDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={deleteProductDialogFooter}
                onHide={hideDeleteProductDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            {/* delete the selected products */}
            <Dialog
                visible={deleteProductsDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={deleteProductsDialogFooter}
                onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default SpecialistChecklist;
