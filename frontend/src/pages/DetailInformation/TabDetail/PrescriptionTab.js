import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
/* A library that allows you to validate the props you pass to your React components. */
import PropTypes from 'prop-types';

import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import {
    ThermometerIcon,
    ArmIcon,
    WeightIcon,
    PulseIcon,
    BreathIcon,
    HeightIcon,
    SearchIcon,
    PlusIcon,
    TrashSmallIcon,
} from '@/components/Icons';
import ButtonComponent from '@/components/Button';

import * as specformService from '@/services/specformService';
import * as prescriptionService from '@/services/prescriptionService';

import classNames from 'classnames/bind';
import styles from './TabDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function PrescriptionTab({ bills, setBills, prescription, setPrescription }) {
    const toast = useRef(null);
    const dt = useRef(null);

    const [drugsAdded, setDrugsAdded] = useState([]);
    const [drugIds, setDrugIds] = useState([...prescription.drugIds]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [drugsAddedFilter, setDrugsAddedFilter] = useState(null);

    useEffect(() => {
        // console.log('prescription', prescription);
        if (drugIds.length > 0) {
            let _drugsAdded = [...drugsAdded];
            drugIds.forEach((id) => {
                bills.forEach((bill) => {
                    if (id === bill.drugbookID) {
                        _drugsAdded.push(bill);
                    }
                });
            });

            setDrugsAdded(_drugsAdded);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const handleChange = (e) => {
    //     const val = (e.target && e.target.value) || '';
    //     setOverResult(val)
    // }

    // const handlerComplete = () => {

    //     let _overResult = overResult;
    //     specformService.updateOverResult(_overResult,_id)
    //         .then((result) => {
    //             console.log(result);
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Overview Result Updated',
    //                 life: 3000,
    //             });

    //         });
    // }

    const handlerAddDrug = (e, drug) => {
        let _drug = { ...drug };
        let _drugsAdded = [...drugsAdded];
        let _drugIds = [...drugIds];
        if (!_drugIds.includes(_drug.drugbookID)) {
            _drugsAdded.push(_drug);
            _drugIds.push(_drug.drugbookID);
            setDrugsAdded(_drugsAdded);
            setDrugIds(_drugIds);
        }
        e.stopPropagation();
    };

    const handlerRemoveDrug = (e, drug) => {
        let _drug = { ...drug };
        let _drugsAdded = [...drugsAdded];
        let _drugIds = [...drugIds];
        _drugsAdded = _drugsAdded.filter((item) => item.drugbookID !== _drug.drugbookID);
        _drugIds = _drugIds.filter((item) => item !== _drug.drugbookID);
        console.log('drug added', _drugsAdded);
        setDrugsAdded(_drugsAdded);
        setDrugIds(_drugIds);
        e.stopPropagation();
    };

    const handlerComplete = () => {
        let _drugIds = [...drugIds];
        _drugIds.sort();
        let _prescription = { ...prescription };
        _prescription.drugIds = _drugIds;
        console.log(_prescription);
        prescriptionService.updatePrescription(_prescription, _prescription.prescriptionId).then((result) => {
            console.log(result);
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Prescription Updated',
                life: 3000,
            });
        });

        // let _overResult = overResult;
        // specformService.updateOverResult(_overResult, _id).then((result) => {
        //     console.log(result);
        //     toast.current.show({
        //         severity: 'success',
        //         summary: 'Successful',
        //         detail: 'Overview Result Updated',
        //         life: 3000,
        //     });
        // });
    };

    const DataTableCrudDemo = ({ data, filter, selected, setSelected, iconAction, handlerClickBtn }) => {
        const actionBodyTemplate = (rowData) => {
            return (
                <Fragment>
                    {/* thu vien */}
                    {/* <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-success mr-2"
                        onClick={() => editProduct(rowData)}
                    /> */}
                    <button className={cx('btn-delete')} onClick={(e) => handlerClickBtn(e, rowData)}>
                        <span className={cx('icon')}>{iconAction}</span>
                    </button>
                    {/* <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteProduct(rowData)}
                    /> */}
                    {/* <button className={cx('btn-delete')} onClick={(e) => confirmDeleteProduct(e,rowData)}>
                            <span className={cx('icon')}>
                                <TrashSmallIcon />
                            </span>
                        </button> */}
                </Fragment>
            );
        };

        return (
            <div className="card" id="invoice">
                <DataTable
                    ref={dt}
                    value={data}
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value)}
                    dataKey="_id"
                    paginator
                    rows={5}
                    // rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={filter}
                    //header={header}
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
                        field="drugbookID"
                        header="ID"
                        sortable
                        style={{ minWidth: '8rem' }}
                    ></Column>
                    <Column
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        field="drugname"
                        header="Drug's name"
                        sortable
                        style={{ minWidth: '12rem' }}
                    ></Column>
                    <Column
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        field="unit"
                        header="Unit"
                        sortable
                        style={{ minWidth: '10rem' }}
                    ></Column>
                    <Column
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        field="unitprice"
                        header="Unit/Price"
                        sortable
                        style={{ minWidth: '10rem' }}
                    ></Column>
                    <Column
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        field="quantity"
                        header="Quantity"
                        sortable
                        style={{ minWidth: '12rem' }}
                    ></Column>
                    <Column
                        header="Action"
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: '10rem' }}
                    ></Column>
                </DataTable>
            </div>
        );
    };

    return (
        <div className={cx('grid', 'wide')}>
            <Toast ref={toast} />
            <div className={cx('btn-group')}>
                <ButtonComponent
                    className={cx('btn-add')}
                    primary
                    large
                    // leftIcon={<TrashSmallIcon width="1.6rem" height="1.6rem" />}
                    onClick={handlerComplete}
                    // disable={!selectedProducts || !selectedProducts.length}
                >
                    Complete
                </ButtonComponent>
            </div>
            <div className={cx('row', 'drug-list')}>
                <label className={cx('title')}>Drug List</label>
                <div className={cx('toolbar')}>
                    <div className={cx('search')}>
                        <span className={cx('search-icon')}>
                            <SearchIcon />
                        </span>
                        <InputText
                            className={cx('search-input')}
                            type="search"
                            onInput={(e) => setDrugsAddedFilter(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>
                    <div className={cx('btn-group')}>
                        <ButtonComponent
                            className={cx('btn-add')}
                            primary
                            large
                            leftIcon={<FontAwesomeIcon icon={faTrash} />}
                            // onClick={openNew}
                            style={{ marginRight: '10px' }}
                        >
                            Remove
                        </ButtonComponent>
                    </div>
                </div>
                <DataTableCrudDemo
                    data={drugsAdded}
                    filter={drugsAddedFilter}
                    selected={selectedDrugs}
                    setSelected={setSelectedDrugs}
                    iconAction={<TrashSmallIcon />}
                    handlerClickBtn={handlerRemoveDrug}
                />
            </div>
            <div className={cx('row', 'drug-list')}>
                <label className={cx('title')}>Drug List</label>
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
                        <ButtonComponent
                            className={cx('btn-add')}
                            primary
                            large
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            style={{ marginRight: '10px' }}
                            // onClick={openNew}
                        >
                            Add
                        </ButtonComponent>
                    </div>
                </div>
                <DataTableCrudDemo
                    data={bills}
                    filter={globalFilter}
                    selected={selectedProducts}
                    setSelected={setSelectedProducts}
                    iconAction={<PlusIcon width="1.8rem" height="1.8rem" />}
                    handlerClickBtn={handlerAddDrug}
                />
            </div>
        </div>
    );
}

// PrescriptionTab.prototype={
//     overResult: PropTypes.string,
// }

export default PrescriptionTab;
