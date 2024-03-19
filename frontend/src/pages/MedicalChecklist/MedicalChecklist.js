import classNames from 'classnames/bind';
import React, { useState, useEffect, useRef } from 'react';

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
import MyBtn from '@/components/Button';
import { SearchIcon, TrashSmallIcon, PencilSmallIcon, RequestIcon } from '@/components/Icons';
import * as meformService from '@/services/meformService';
import * as personService from '@/services/personService';
import * as specFormService from '@/services/specformService';
import styles from './MedicalChecklist.module.scss';

const cx = classNames.bind(styles);

function MedicalChecklist() {
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

    const emptyCounter = {
        mEFormSeq: 0,
        patientSeq: 0,
    };

    const [meforms, setMeforms] = useState(null);
    const [meform, setMeform] = useState(emptyMEForm);
    const [changeData, setChangeData] = useState(false);
    const [counterMEForm, setCounterMEForm] = useState(emptyCounter);
    const [persons, setPersons] = useState(null);
    const [roomsSelected, setRoomsSelected] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState(null);
    const [isAddRoom, setIsAddRoom] = useState(false);
    const [requests, setRequests] = useState([]);
    const [request, setRequest] = useState('');

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
        meformService.getMEFormList().then((data) => {
            let newMEForms = data.map((item) => {
                let newItem = { ...item };
                newItem.formId = item.formId.toLocaleString();
                newItem.patientId = item.patientId.toLocaleString();
                newItem.dateStr = new Date(item.date).toLocaleDateString('us-US');
                newItem.date = new Date(item.date);
                return newItem;
            });
            setMeforms(newMEForms);
        });
        meformService.getCounterMEForm().then((data) => {
            const _counterMEForm = {
                mEFormSeq: data.mEForm.seq + 1,
                patientSeq: data.patient.seq + 1,
            };

            setCounterMEForm(_counterMEForm);
        });

        meformService.getRoomsToForm().then((data) => {
            setRooms(data);
        });

        personService.getListToForm().then((data) => {
            setPersons(data);
        });
    }, [changeData]); // eslint-disable-line react-hooks/exhaustive-deps

    const onPersonChange = (e) => {
        let _meform = { ...meform };
        _meform.personId = e.value.personId;
        _meform._person = e.value;
        setMeform(_meform);
        // setSelectedPerson(e.value);
        // console.log(_meform);
    };

    const onRoomChange = (e) => {
        let _room = e.value;
        setRoom(_room);
        if (meform.roomIds.includes(_room.roomId)) {
            setIsAddRoom(false);
        } else {
            setIsAddRoom(true);
        }
    };

    const addRoomSelected = () => {
        let _meform = { ...meform };
        let _roomsSelected = [...roomsSelected];
        let _room = { ...room };
        _roomsSelected.push(_room);
        _meform.roomIds.push(_room.roomId);
        setRoomsSelected(_roomsSelected);
        setMeform(_meform);
        setIsAddRoom(false);
        setRoom(null);
    };

    const clearRoomSelected = () => {
        setIsAddRoom(false);
        setRoom(null);
    };

    const openNew = () => {
        setMeform(emptyMEForm);
        setRoomsSelected([]);

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

        let _meform = { ...meform };
        let inputSpecForm = {
            formId: _meform.formId,
            roomIds: _meform.roomIds,
            request: 'request',
            patientId: _meform.patientId,
        };
        if (_meform._patient.name.trim()) {
            if (meform._id) {
                // console.log('data', _meform);
                Promise.all([
                    meformService.updateMEForm(_meform, _meform._id),
                    specFormService.createManySpecForm(inputSpecForm),
                ]).then(([data, result]) => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Form Created',
                        life: 3000,
                    });

                    setProductDialog(false);
                    setMeform(emptyMEForm);
                    setChangeData(!changeData);
                });
            } else {
                // console.log('data',_meform);
                _meform.patientId = counterMEForm.patientSeq;
                Promise.all([meformService.createMEForm(_meform)]).then(([datat]) => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000,
                    });

                    setProductDialog(false);
                    setMeform(emptyMEForm);
                    setChangeData(!changeData);
                });
            }
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
        let _meform = { ...meform };

        switch (type) {
            case 'form': {
                // console.log(val);
                _meform[`${name}`] = val;
                break;
            }
            case 'patient':
                _meform._patient[`${name}`] = val;
                break;
            case 'person':
                _meform._person[`${name}`] = val;
                break;
            default:
                break;
        }

        setMeform(_meform);
    };

    const onDateChange = (e) => {
        let _meform = { ...meform };
        _meform.date = e.value;
        setMeform(_meform);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
        setChangeData(!changeData);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const deleteProduct = () => {
        let _meform = { ...meform };
        meformService.deleteMEForm(_meform._id).then((data) => {
            setChangeData(!changeData);
            setDeleteProductDialog(false);
            setMeform(emptyMEForm);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Form Deleted', life: 3000 });
        });
    };

    const deleteSelectedProducts = () => {
        let _selectedProducts = [...selectedProducts];
        let formIds = [];

        _selectedProducts.forEach((item) => {
            formIds.push(item._id);
        });

        meformService.deleteSelectedMEForm(formIds).then((data) => {
            setChangeData(!changeData);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        });
    };

    const submitRequest = (e, room) => {};

    const deleteRoomSelected = (e, room) => {
        let _meform = { ...meform };
        let _roomsSelected = [...roomsSelected];

        _roomsSelected = _roomsSelected.filter((item) => item.roomId !== room.roomId);
        _meform.roomIds = _meform.roomIds.filter((item) => item !== room.roomId);

        setRoomsSelected(_roomsSelected);
        setMeform(_meform);
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

    const actionRoomBodyTemplate = (rowData) => {
        return (
            <div className={cx('actionBtns')}>
                {/* <button className={cx('btn-delete')} onClick={(e) => submitRequest(e, rowData)}>
                    <span className={cx('icon')}>
                        <RequestIcon />
                    </span>
                </button> */}
                {/* <div className={cx('box-request')}>
                    <label htmlFor="requestSpecForm" className={cx('label-input')}>
                        Request
                    </label>
                    <InputText
                        id="requestSpecForm"
                        value={request}
                        // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                    />

                    <button>Submit</button>
                </div> */}
                <button className={cx('btn-delete')} onClick={(e) => deleteRoomSelected(e, rowData)}>
                    <span className={cx('icon')}>
                        <TrashSmallIcon />
                    </span>
                </button>
            </div>
        );
    };

    const DataTableCrudDemo = () => {
        const editProduct = (e, meform) => {
            setMeform({ ...meform });

            let _roomsSelected = [];
            rooms.forEach((item) => {
                if (meform.roomIds.includes(item.roomId)) {
                    _roomsSelected.push(item);
                }
            });

            setRoomsSelected(_roomsSelected);
            setProductDialog(true);
            e.stopPropagation();
        };

        const confirmDeleteProduct = (e, meform) => {
            setMeform(meform);
            setDeleteProductDialog(true);
            e.stopPropagation();
        };

        const actionBodyTemplate = (rowData) => {
            return (
                <div className={cx('actionBtns')}>
                    <button className={cx('btn-delete')} onClick={(e) => editProduct(e, rowData)}>
                        <span className={cx('icon')}>
                            <PencilSmallIcon />
                        </span>
                    </button>
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
                        value={meforms}
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
                            field="formId"
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
            <h2 className={cx('header-title')}>Medical Checklist</h2>
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
                        <MyBtn
                            className={cx('btn-add')}
                            primary
                            large
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={openNew}
                        >
                            New
                        </MyBtn>
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
                                    value={meform.formId === 0 ? counterMEForm.patientSeq : meform.patientId}
                                    required
                                    disabled
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="patientName">Full Name</label>
                                <InputText
                                    id="patientName"
                                    value={meform._patient.name}
                                    onChange={(e) => onInputChange(e, 'name', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    className={cx({ 'p-invalid': submitted && !product.name })}
                                />
                                {submitted && !meform._patient.name && (
                                    <small className="p-error">Name is required.</small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="patientAddress">Address</label>
                                <InputText
                                    id="patientAddress"
                                    value={meform._patient.address}
                                    onChange={(e) => onInputChange(e, 'address', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                            <div className="field col">
                                <label htmlFor="patientPhone">Phone number</label>
                                <InputText
                                    id="patientPhone"
                                    value={meform._patient.phone}
                                    onChange={(e) => onInputChange(e, 'phone', 'patient')}
                                    required
                                    autoFocus
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="patientJob">Job</label>
                                <InputText
                                    id="patientJob"
                                    value={meform._patient.career}
                                    onChange={(e) => onInputChange(e, 'career', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name }
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                            <div className="field col">
                                <label htmlFor="patientAge">Age</label>
                                <InputText
                                    id="patientAge"
                                    value={meform._patient.age}
                                    onChange={(e) => onInputChange(e, 'age', 'patient')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.na
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1>Information of form</h1>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="formId" className={cx('label-input')}>
                                    Id General Form
                                </label>
                                <InputText
                                    id="formId"
                                    value={meform.formId === 0 ? counterMEForm.mEFormSeq : meform.formId}
                                    required
                                    disabled
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="numOrder">Ordinal numbers</label>
                                <InputText
                                    id="numOrder"
                                    value={meform.numOrder}
                                    onChange={(e) => onInputChange(e, 'numOrder')}
                                    required
                                    autoFocus
                                    // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                    // className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                />
                                {/* {submitted && !meform.numOrder && <small className="p-error">Name is required.</small>} */}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="personName" className={cx('label-input')}>
                                    Full name of Doctor
                                </label>

                                <Dropdown
                                    className={cx('dialog-dropdown')}
                                    value={meform._person}
                                    // value={meform.personId === 0 ? selectedPerson : meform._person}
                                    options={persons}
                                    onChange={onPersonChange}
                                    optionLabel="name"
                                    placeholder={'Select a doctor'}
                                    // disabled = {meform.formId === 0 ? false : true}
                                />
                                {/* {submitted && !meform.personId && <small className="p-error">Name is required.</small>} */}
                            </div>
                            <div className="field col">
                                <label htmlFor="date">Date</label>

                                <Calendar id="icon" value={meform.date} onChange={(e) => onDateChange(e)} showIcon />

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
                    <div className="field">
                        <label htmlFor="reason">Reasons to see a doctor</label>
                        <InputTextarea
                            id="reason"
                            value={meform.reason}
                            onChange={(e) => onInputChange(e, 'reason')}
                            required
                            rows={3}
                            cols={20}
                        />
                    </div>
                    <div className="field">
                        <label className={cx('label-input')}>Clinic Rooms</label>

                        <div className={cx('input-room-group')}>
                            <Dropdown
                                className={cx('dialog-dropdown')}
                                value={room}
                                // value={meform.personId === 0 ? selectedPerson : meform._person}
                                options={rooms}
                                onChange={onRoomChange}
                                optionLabel="name"
                                placeholder={'Select a room to add'}
                                // disabled = {meform.formId === 0 ? false : true}
                            />

                            <MyBtn
                                className={cx('btn-add')}
                                primary
                                small
                                leftIcon={<FontAwesomeIcon icon={faXmark} />}
                                disable={!isAddRoom}
                                onClick={clearRoomSelected}
                            >
                                Clear
                            </MyBtn>

                            <MyBtn
                                className={cx('btn-add')}
                                primary
                                small
                                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                disable={!isAddRoom}
                                onClick={addRoomSelected}
                            >
                                Add
                            </MyBtn>
                        </div>

                        <div className={cx('dialog-table-rooms')}>
                            <DataTable
                                value={roomsSelected}
                                responsiveLayout="scroll"
                                className={cx('data-table', 'spec-form')}
                            >
                                <Column
                                    headerClassName={cx('column-thead', 'data-table-thead')}
                                    bodyClassName={cx('column', 'data-table-td')}
                                    field="roomId"
                                    header="Room ID"
                                    style={{ minWidth: '8rem' }}
                                ></Column>
                                <Column
                                    headerClassName={cx('column-thead', 'data-table-thead')}
                                    bodyClassName={cx('column', 'data-table-td')}
                                    field="name"
                                    header="Name"
                                    style={{ minWidth: '16rem' }}
                                ></Column>
                                <Column
                                    headerClassName={cx('column-thead', 'data-table-thead')}
                                    bodyClassName={cx('column', 'data-table-td')}
                                    body={actionRoomBodyTemplate}
                                    style={{ minWidth: '8rem' }}
                                ></Column>
                                {/* <Column field="category" header="Category"></Column>
                                <Column field="quantity" header="Quantity"></Column> */}
                            </DataTable>
                        </div>
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

export default MedicalChecklist;
