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
import { Chart } from 'primereact/chart';

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
///chart

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
    ///chart
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    ////chart

    const [products, setProducts] = useState(null);

    // const [accounts, setAccounts] = useState(null);

    const [account, setAccount] = useState(emptyAccount);

    const [changeData, setChangeData] = useState(false);
    const [counterAccount, setcounterAccount] = useState(0);

    const [mana, countMana] = useState(0);
    const [pha, countPha] = useState(0);
    const [spe, countSpecial] = useState(0);
    const [staff, countStaff] = useState(0);
    const [general, countGeneral] = useState(0);

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
        // accountService.getAccountList().then((data) => {
        //     setAccounts(data);
        //     console.log(data);
        // });
        accountService.getCounterAccount().then((data) => {
            setcounterAccount(data.seq);
        });
        accountService.getcountPha().then((pha1) => {
            countPha(pha1);
            console.log(pha);
        });
        accountService.getcountMana().then((mana1) => {
            countMana(mana1);
            console.log(mana);
        });
        accountService.getcountSpecial().then((spe1) => {
            countSpecial(spe1);
            console.log(spe);
        });
        accountService.getcountStaff().then((staff1) => {
            countStaff(staff1);
            console.log(staff);
        });
        accountService.getcountGeneral().then((general1) => {
            countGeneral(general1);
            console.log(general);
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Pharmacist', 'Specilist doctor', 'General doctor', 'Staff', 'Manager'],
            datasets: [
                {
                    data: [pha, spe, general, staff, mana],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--brown-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--brown-500'),
                    ],
                },
            ],
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, [pha, spe, general, staff, mana]); // eslint-disable-line react-hooks/exhaustive-deps

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

        // let _accounts = [...accounts];
        let _account = { ...account };
        if (account._id) {
            // const index = findIndexById(product.id);
            accountService.updateAccount(_account, _account._id).then((data) => {
                console.log(data);
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
                console.log(data);
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
    };

    const onInputChange = (e, name) => {
        console.log(e.target.value);
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
        accountService.deleteAccount(_account._id).then((data) => {
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
            formIds.push(item._id);
        });
        accountService.deleteSelectedAccount(formIds).then((data) => {
            console.log(data);
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
                <div className="card"></div>
            </div>
        );
    };
    return (
        <div className={cx('wrapper')}>
            <Toast ref={toast} />
            <h2 className={cx('header-title')}>Return-Report</h2>
            <div className={cx('body')}>
                <div className="card flex justify-content-center">
                    <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                </div>
            </div>
        </div>
    );
}

export default ManagerAccount;
