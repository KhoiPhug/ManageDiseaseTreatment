import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind'; //hung

import { classNames as classNamesPrime } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SearchIcon, TrashSmallIcon, PencilSmallIcon } from '@/components/Icons';
import './index.css';
import './DataTableDemo.css';
import MyBtn from '@/components/Button';
import { TrashIcon } from '@/components/Icons';
import { ProductService } from './ProductService';
import * as accountService from '@/services/accountService'; //1
import styles from './ManagerAccount.module.scss'; //hung
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, {Component} from 'react';
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
const cx = classNames.bind(styles);

function ManagerAccount() {
    let emptyProduct = {
        id: null,
        //name: '',
        username: '',
        // image: null,
        description: '',
        category: null,
        price: null,
        quantity: 0,
        rating: 0,
        //inventoryStatus: 'INSTOCK',
    };
    let emptyAccount = {
        ID: 0,
        username: null,
        password: null,
        fullname: null,
        job: null,
        //inventoryStatus: 'INSTOCK',
    };

    const [products, setProducts] = useState(null);

    const [accounts, setAccounts] = useState(null);

    const [account, setAccount] = useState(emptyAccount);

    const [changeData, setChangeData] = useState(false);
    const [counterAccount, setcounterAccount] = useState(0);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const productService = new ProductService();

    useEffect(() => {
        productService.getProducts().then((data) => setProducts(data));
        accountService.getAccountList().then((data) => {
            setAccounts(data);
        });
        accountService.getCounterAccount().then((data) => {
            setcounterAccount(data.seq);
        });
    }, [changeData]); // eslint-disable-line react-hooks/exhaustive-deps

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setAccount(emptyAccount);
        setSubmitted(false);
        setProductDialog(true);
    };
    const saveAccount = () => {
        setSubmitted(true);

        let _accounts = [...accounts];
        let _account = { ...account };
        _account.accountId = counterAccount + 1;
        if (_account.fullname.trim() && _account.username) {
            if (account._id) {
                // const index = findIndexById(product.id);
                _account.accountId = _account.ID;
                accountService.updateAccount(_account, _account._id).then((data) => {
                    setProductDialog(false);
                    setAccount(emptyAccount);
                    setChangeData(!changeData);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000,
                    });
                });

                // _products[index] = _product;
            } else {
                accountService.createAccount(_account).then((data) => {
                    setProductDialog(false);
                    setAccount(emptyAccount);
                    setChangeData(!changeData);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000,
                    });
                });

                // setProducts(_products);
            }
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _account = { ...account };
        _account[`${name}`] = val;

        setAccount(_account);
    };

    const onCategoryChange = (e) => {
        // let _product = { ...product };
        // _product['category'] = e.value;
        // setProduct(_product);
        let _account = { ...account };
        _account['job'] = e.value;
        setAccount(_account);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button
                className={cx('btn-cancel')}
                label="Cancel"
                icon="pi pi-times"
                style={{ color: '#153AFF', background: '#ffffff' }}
                onClick={hideDialog}
            />
            <Button
                className={cx('btn-yes')}
                label="Save"
                icon="pi pi-check"
                style={{ color: '#ffffff', background: '#153AFF' }}
                onClick={saveAccount}
            />
        </React.Fragment>
    );

    const confirmDeleteProduct = (e, account) => {
        // setProduct(product);
        setAccount(account);
        setDeleteProductDialog(true);
        e.stopPropagation();
    };

    const deleteProduct = () => {
        // let _products = products.filter((val) => val.id !== product.id);
        // setProducts(_products);
        let _account = { ...account };
        accountService.deleteAccount(_account.ID).then((data) => {
            setChangeData(!changeData);
            setDeleteProductDialog(false);
            // setProduct(emptyProduct);
            setAccount(emptyAccount);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        });
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const deleteSelectedProducts = () => {
        // let _products = products.filter((val) => !selectedProducts.includes(val));
        // setProducts(_products);
        let _selectedProducts = [...selectedProducts];
        let formIds = [];
        //console.log(selectedProducts);
        _selectedProducts.forEach((item) => {
            formIds.push(item.ID);
        });
        accountService.deleteSelectedAccount(formIds).then((data) => {
            setChangeData(!changeData);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        });
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button
                className={cx('btn-cancel')}
                label="No"
                style={{ color: '#153AFF', background: '#ffffff' }}
                icon="pi pi-times"
                onClick={hideDeleteProductDialog}
            />
            <Button
                className={cx('btn-yes')}
                label="Yes"
                icon="pi pi-check"
                style={{ color: '#ffffff', background: '#153AFF' }}
                onClick={deleteProduct}
            />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button
                className={cx('btn-cancel')}
                label="No"
                style={{ color: '#153AFF', background: '#ffffff' }}
                icon="pi pi-times"
                onClick={hideDeleteProductsDialog}
            />
            <Button
                className={cx('btn-yes')}
                label="Yes"
                icon="pi pi-check"
                style={{ color: '#ffffff', background: '#153AFF' }}
                onClick={deleteSelectedProducts}
            />
        </React.Fragment>
    );

    const DataTableCrudDemo = () => {
        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        };

        const editProduct = (account) => {
            setAccount({ ...account });
            setProductDialog(true);
        };

        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        };

        const createId = () => {
            let id = '';
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 5; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        };

        const importCSV = (e) => {
            const file = e.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                const data = csv.split('\n');

                // Prepare DataTable
                const cols = data[0].replace(/['"]+/g, '').split(',');
                data.shift();

                const importedData = data.map((d) => {
                    d = d.split(',');
                    const processedData = cols.reduce((obj, c, i) => {
                        c = c === 'Status' ? 'inventoryStatus' : c === 'Reviews' ? 'rating' : c.toLowerCase();
                        obj[c] = d[i].replace(/['"]+/g, '');
                        (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                        return obj;
                    }, {});

                    processedData['id'] = createId();
                    return processedData;
                });

                const _products = [...products, ...importedData];

                setProducts(_products);
            };

            reader.readAsText(file, 'UTF-8');
        };

        const exportCSV = () => {
            dt.current.exportCSV();
        };

        const onInputNumberChange = (e, name) => {
            const val = e.value || 0;
            let _product = { ...product };
            _product[`${name}`] = val;

            setProduct(_product);
        };

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {/* <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} /> */}
                    {/* <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedProducts || !selectedProducts.length}
                /> */}
                </React.Fragment>
            );
        };

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {/* <FileUpload
                    mode="basic"
                    name="demo[]"
                    auto
                    url="https://primefaces.org/primereact/showcase/upload.php"
                    accept=".csv"
                    chooseLabel="Import"
                    className="mr-2 inline-block"
                    onUpload={importCSV}
                /> */}
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            style={{ minWidth: '18rem' }}
                            left="30px"
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search..."
                        />
                    </span>
                    <Button
                        label="Create"
                        style={{ color: '#4962E9', background: '#BFE6F4' }}
                        icon="pi pi-plus"
                        className={cx('create-btn')}
                        onClick={openNew}
                    />
                    {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                </React.Fragment>
            );
        };

        const imageBodyTemplate = (rowData) => {
            return (
                <img
                    src={`images/product/${rowData.image}`}
                    onError={(e) =>
                        (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                    }
                    alt={rowData.image}
                    className="product-image"
                />
            );
        };

        const priceBodyTemplate = (rowData) => {
            return formatCurrency(rowData.price);
        };

        const ratingBodyTemplate = (rowData) => {
            return <Rating value={rowData.rating} readOnly cancel={false} />;
        };

        const statusBodyTemplate = (rowData) => {
            return (
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>
                    {rowData.inventoryStatus}
                </span>
            );
        };

        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    {/* thu vien */}
                    {/* <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editProduct(rowData)}
                /> */}
                    <button className={cx('btn-delete')} onClick={() => editProduct(rowData)}>
                        <span className={cx('icon', 'iconn')}>
                            <PencilSmallIcon />
                        </span>
                    </button>
                    {/* <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(rowData)}
                /> */}
                    <button className={cx('btn-delete')} onClick={(e) => confirmDeleteProduct(e, rowData)}>
                        <span className={cx('icon')}>
                            <TrashSmallIcon />
                        </span>
                    </button>
                </React.Fragment>
            );
        };

        const header = (
            <div className="table-header">
                {/* <h5 className="mx-0 my-1">Manage Products</h5> */}
                {/* <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span> */}
            </div>
        );

        return (
            <div className="">
                <div className="card">
                    <DataTable
                        ref={dt}
                        value={accounts}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
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
                            field="ID"
                            header="ID"
                            sortable
                            style={{ minWidth: '8rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="fullname"
                            header="Fullname"
                            sortable
                            style={{ minWidth: '16rem' }}
                        ></Column>
                        {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                        {/* <Column
                        field="price"
                        header="Price"
                        body={priceBodyTemplate}
                        sortable
                        style={{ minWidth: '8rem' }}
                    ></Column> */}
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="username"
                            header="Username"
                            sortable
                            style={{ minWidth: '16rem' }}
                        ></Column>
                        <Column
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            field="job"
                            header="Job"
                            sortable
                            style={{ minWidth: '12rem' }}
                        ></Column>
                        {/* <Column
                        field="rating"
                        header="Reviews"
                        body={ratingBodyTemplate}
                        sortable
                        style={{ minWidth: '12rem' }}
                    ></Column>
                    <Column
                        field="inventoryStatus"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                        style={{ minWidth: '12rem' }}
                    ></Column> */}
                        <Column
                            header="Action"
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
            <h2 className={cx('header-title')}>Manager Account</h2>
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
                <Dialog
                    visible={productDialog}
                    headerClassName={cx('detail-dialog-header')}
                    //header="Product Details"
                    header="Create account"
                    // style="color: blue;"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                >
                    <div className={cx('dialog')}>
                        <head>
                            <title>Page Title</title>
                        </head>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="ID" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                    <b>Id</b>
                                </label>
                                <InputText
                                    id="ID"
                                    value={account.ID === 0 ? counterAccount + 1 : account.ID}
                                    disabled
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="fullname" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                    <b>Fullname</b>
                                </label>
                                <InputText
                                    id="fullname"
                                    value={account.fullname}
                                    onChange={(e) => onInputChange(e, 'fullname')}
                                    autoFocus
                                    required
                                    className={cx({ 'p-invalid': submitted && !product.name })}
                                />
                                {submitted && !account.fullname && (
                                    <small className="p-error">Fullname is required.</small>
                                )}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="username" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                    <b>Username</b>
                                </label>
                                <InputText
                                    id="username"
                                    value={account.username}
                                    onChange={(e) => onInputChange(e, 'username')}
                                    // autoFocus
                                    required
                                    className={cx({ 'p-invalid': submitted && !product.name })}
                                    //mode="currency"
                                    //currency="USD"
                                    // locale="en-US"
                                />
                                {submitted && !account.username && (
                                    <small className="p-error">Username is required.</small>
                                )}
                            </div>
                        </div>

                        <div className="field">
                            <label className="mb-3" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Role</b>
                            </label>
                            {/* classNăe="feild cold" */}
                            <div className={cx('grid-container')}>
                                <div class={cx('grid-item')}>
                                    <RadioButton
                                        inputId="category1"
                                        name="job"
                                        value="Manager"
                                        onChange={onCategoryChange}
                                        checked={account.job === 'Manager'}
                                    />
                                    <label htmlFor="Manager" style={{ color: '#0D5BF1' }}>
                                        Manager
                                    </label>
                                </div>
                                <div class={cx('grid-item')}>
                                    <RadioButton
                                        inputId="category2"
                                        name="job"
                                        value="Staff"
                                        onChange={onCategoryChange}
                                        checked={account.job === 'Staff'}
                                    />
                                    <label htmlFor="Staff" style={{ color: '#0D5BF1' }}>
                                        Staff
                                    </label>
                                </div>
                                <div class={cx('grid-item')}>
                                    <RadioButton
                                        inputId="category3"
                                        name="job"
                                        value="Specialist doctor"
                                        onChange={onCategoryChange}
                                        checked={account.job === 'Specialist doctor'}
                                    />
                                    <label htmlFor="Specialist doctor" style={{ color: '#0D5BF1' }}>
                                        Specialist doctor
                                    </label>
                                </div>
                                <div class={cx('grid-item')}>
                                    <RadioButton
                                        inputId="category4"
                                        name="job"
                                        value="General doctor"
                                        onChange={onCategoryChange}
                                        checked={account.job === 'General doctor'}
                                    />
                                    <label htmlFor="General doctor" style={{ color: '#0D5BF1' }}>
                                        General doctor
                                    </label>
                                </div>
                                {/* className="field-radiobutton col-6" */}
                                <div class={cx('grid-item')}>
                                    <RadioButton
                                        inputId="category5"
                                        name="job"
                                        value="Pharmacist"
                                        onChange={onCategoryChange}
                                        checked={account.job === 'Pharmacist'}
                                    />
                                    <label htmlFor="Pharmacist" style={{ color: '#0D5BF1' }}>
                                        Pharmacist
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    visible={deleteProductDialog}
                    style={{ width: '450px', color: '#153AFF' }}
                    header="Confirm"
                    modal
                    footer={deleteProductDialogFooter}
                    onHide={hideDeleteProductDialog}
                    headerClassName={cx('detail-dialog-header')}
                >
                    <div>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#153AFF' }} />
                        {product && (
                            <span /*style="font-size:10px"*/>
                                <b>
                                    Are you sure you want to delete account have <i>ID: {account.ID}</i>{' '}
                                </b>{' '}
                                ?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteProductsDialog}
                    style={{ width: '450px' }}
                    header="Confirm"
                    modal
                    footer={deleteProductsDialogFooter}
                    onHide={hideDeleteProductsDialog}
                >
                    {/* <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div> */}
                    <div>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#153AFF' }} />
                        {product && (
                            <span /*style="font-size:10px"*/>
                                <b>Are you sure you want to delete the selected accounts</b> ?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default ManagerAccount;
