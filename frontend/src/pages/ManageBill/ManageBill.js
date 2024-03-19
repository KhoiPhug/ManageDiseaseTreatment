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
import { SearchIcon, TrashSmallIcon, PencilSmallIcon, PDFIcon, PayIcon } from '@/components/Icons';
import './index.css';
import './DataTableDemo.css';
import MyBtn from '@/components/Button';
import { TrashIcon } from '@/components/Icons';
import { ProductService } from './ProductService';
import * as billService from '@/services/billService'; //1
import styles from './ManageBill.module.scss'; //hung
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ManagerBill() {
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

    const [products, setProducts] = useState(null);

    const [bills, setBills] = useState([]);

    const [bill, setBill] = useState(emptyBill);

    const [changeData, setChangeData] = useState(false);
    const [counterBill, setcounterBill] = useState(0);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const productService = new ProductService();

    useEffect(() => {
        productService.getProducts().then((data) => setProducts(data));
        billService.getBillList().then((data) => {
            setBills(data);
            console.log(data);
        });
        billService.getCounterBill().then((data) => {
            setcounterBill(data.seq);
        });
    }, [changeData]); // eslint-disable-line react-hooks/exhaustive-deps

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setBill(emptyBill);
        setSubmitted(false);
        setProductDialog(true);
    };
    const saveBill = () => {
        setSubmitted(true);

        //let _bills = [...bills];
        let _bill = { ...bill };
        if (bill._id) {
            // const index = findIndexById(product.id);
            billService.updateBill(_bill, _bill._id).then((data) => {
                console.log(data);
                setProductDialog(false);
                setBill(emptyBill);
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
            billService.createBill(_bill).then((data) => {
                console.log(data);
                setProductDialog(false);
                setBill(emptyBill);
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
        let _bill = { ...bill };
        _bill[`${name}`] = val;

        setBill(_bill);
    };

    // const onCategoryChange = (e) => {
    //     // let _product = { ...product };
    //     // _product['category'] = e.value;
    //     // setProduct(_product);
    //     let _bill= {...bill};
    //     _bill['job'] = e.value;
    //     setBill(_bill);
    // };

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
                onClick={saveBill}
            />
        </React.Fragment>
    );

    const confirmDeleteProduct = (e, bill) => {
        // setProduct(product);
        setBill(bill);
        setDeleteProductDialog(true);
        e.stopPropagation();
    };

    const deleteProduct = () => {
        // let _products = products.filter((val) => val.id !== product.id);
        // setProducts(_products);
        let _bill = { ...bill };
        billService.deleteBill(_bill._id).then((data) => {
            setChangeData(!changeData);
            setDeleteProductDialog(false);
            // setProduct(emptyProduct);
            setBill(emptyBill);
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
        billService.deleteSelectedBill(formIds).then((data) => {
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
                label="Cancel"
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
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const DataTableCrudDemo = () => {
        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        };

        const editProduct = (bill) => {
            setBill({ ...bill });
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
        // const generalPDF =() =>{
        //         var quotes = document.getElementById('container-fluid');

        //         html2canvas(quotes, {
        //             onrendered: function(canvas) {
        //              window.jsPDF = window.jspdf.jsPDF;
        //             //! MAKE YOUR PDF
        //             var pdf = new jsPDF('p', 'pt', 'letter');

        //             for (var i = 0; i <= quotes.clientHeight/980; i++) {
        //                 //! This is all just html2canvas stuff
        //                 var srcImg  = canvas;
        //                 var sX      = 0;
        //                 var sY      = 980*i; // start 980 pixels down for every new page
        //                 var sWidth  = 900;
        //                 var sHeight = 980;
        //                 var dX      = 0;
        //                 var dY      = 0;
        //                 var dWidth  = 900;
        //                 var dHeight = 980;

        //                 window.onePageCanvas = document.createElement("canvas");
        //                 onePageCanvas.setAttribute('width', 900);
        //                 onePageCanvas.setAttribute('height', 980);
        //                 var ctx = onePageCanvas.getContext('2d');
        //                 // details on this usage of this function:
        //                 // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
        //                 ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

        //                 // document.body.appendChild(canvas);
        //                 var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        //                 var width         = onePageCanvas.width;
        //                 var height        = onePageCanvas.clientHeight;

        //                 //! If we're on anything other than the first page,
        //                 // add another page
        //                 if (i > 0) {
        //                     pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
        //                 }
        //                 //! now we declare that we're working on that page
        //                 pdf.setPage(i+1);
        //                 //! now we add content to that page!
        //                 pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));

        //             }
        //             //! after the for loop is finished running, we save the pdf.
        //             pdf.save('test.pdf');
        //         }
        //       });

        // }

        return (
            <div className="">
                <div className="card" id="invoice">
                    <DataTable
                        ref={dt}
                        value={bills}
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
                            field="billID"
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
                            field="amount"
                            header="Amount"
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            // body={ratingBodyTemplate}
                            sortable
                            style={{ minWidth: '12rem' }}
                        ></Column>
                        {/* <Column
                        field="status"
                        header="Status"
                        headerClassName={cx('column-thead')}
                        bodyClassName={cx('column')}
                        //body={statusBodyTemplate}
                        sortable
                        style={{ minWidth: '12rem' }}
                    ></Column> */}
                        <Column
                            header="Action"
                            headerClassName={cx('column-thead')}
                            bodyClassName={cx('column')}
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ minWidth: '10rem' }}
                        ></Column>
                    </DataTable>
                    {/* <p:faPieChart model="#{chartJsView.pieModel}" style="width: 100%; height: 500px;"/> */}
                </div>
                <div>
                    <div className={cx('toolbar')}>
                        <div class={cx('letter')}>
                            <label>
                                <b> Total:</b>
                            </label>{' '}
                            <span id="billID"></span>
                        </div>
                        <div className={cx('btn-group')}>
                            <MyBtn
                                className={cx('btn-add')}
                                id="download"
                                primary
                                large
                                leftIcon={<PDFIcon width="0.5 rem" height="0.5 rem" />}
                                // onClick={openNew}
                                // onClick={window.print()}
                            >
                                PDF
                            </MyBtn>
                            <MyBtn
                                className={cx('btn-add')}
                                primary
                                large
                                leftIcon={<PayIcon width="1.6rem" height="1.6rem" />}
                                // onClick={confirmDeleteSelected}
                                disable={!(selectedProducts.length == bills.length)}
                            >
                                Pay
                            </MyBtn>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className={cx('wrapper')}>
            <head></head>
            <Toast ref={toast} />
            <h2 className={cx('header-title')}>Manage Bill</h2>
            <div className={cx('body')}>
                <div className={cx('grid-container')}>
                    <div class={cx('grid-item', 'letter')}>
                        <label>
                            <b> Id bill:</b>
                        </label>{' '}
                        <span id="billID"></span>
                    </div>
                    <div class={cx('grid-item', 'letter')}>
                        <label>
                            <b> Id patient:</b>
                        </label>{' '}
                        <span id="billID"></span>
                    </div>
                    <div class={cx('grid-item', 'letter')}>
                        <label>
                            <b> Paitent’s name:</b>
                        </label>{' '}
                        <span id="billID"></span>
                    </div>
                    <div class={cx('grid-item', 'letter')}>
                        <label>
                            <b> Phone:</b>
                        </label>{' '}
                        <span id="billID"></span>
                    </div>
                    <div class={cx('grid-item', 'letter')}>
                        <label>
                            <b> Time:</b>
                        </label>{' '}
                        <span id="billID"></span>
                    </div>
                </div>

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
                    //header="Product Details"
                    header="Create bill"
                    // style="color: blue;"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                >
                    <head>
                        <title>Page Title</title>
                    </head>
                    {/* {product.image && (
                    <img
                        src={`images/product/${product.image}`}
                        onError={(e) =>
                            (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                        }
                        alt={product.image}
                        className="product-image block m-auto pb-3"
                    />
                )} */}
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="billID" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Id</b>
                            </label>
                            <InputText
                                id="billID"
                                value={bill.billID === 0 ? counterBill + 1 : bill.billID}
                                disabled
                                //onChange={(e) => onInputChange(e, 'ID')}
                                //autoFocus
                                required
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                // mode="currency"
                                // currency="USD"
                                // locale="en-US"
                            />
                            {submitted && !bill.billID && <small className="p-error">Name is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="drugname" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Drug's name</b>
                            </label>
                            <InputText
                                id="drugname"
                                value={bill.drugname}
                                onChange={(e) => onInputChange(e, 'drugname')}
                                autoFocus
                                required
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {submitted && !bill.drugname && <small className="p-error">Drug's name is required.</small>}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="unit" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Unit</b>
                            </label>
                            <InputText
                                id="unit"
                                value={bill.unit}
                                onChange={(e) => onInputChange(e, 'unit')}
                                //  autoFocus
                                required
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                //mode="currency"
                                //currency="USD"
                                // locale="en-US"
                            />
                            {submitted && !bill.unit && <small className="p-error">Unit is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="unitprice" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Unit/Price</b>
                            </label>
                            <InputText
                                id="unitprice"
                                value={bill.unitprice}
                                onChange={(e) => onInputChange(e, 'unitprice')}
                                required
                                // autoFocus
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {submitted && !bill.unitprice && <small className="p-error">Unit/Price is required.</small>}
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="quantity" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Quantity</b>
                            </label>
                            <InputText
                                id="quantity"
                                value={bill.quantity}
                                onChange={(e) => onInputChange(e, 'quantity')}
                                // autoFocus
                                required
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                                //mode="currency"
                                //currency="USD"
                                // locale="en-US"
                            />
                            {submitted && !bill.quantity && <small className="p-error">Quantity is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="amount" style={{ color: '#0D5BF1', fontSize: '13px' }}>
                                <b>Amount</b>
                            </label>
                            <InputText
                                id="amount"
                                value={bill.amount}
                                onChange={(e) => onInputChange(e, 'amount')}
                                required
                                //autoFocus
                                // className={primeClassnames({ 'p-invalid': submitted && !product.name })}
                                className={cx({ 'p-invalid': submitted && !product.name }, 'hung')}
                            />
                            {submitted && !bill.amount && <small className="p-error">Amount is required.</small>}
                        </div>
                    </div>
                    <div className="field">
                        {/* <label className="mb-3"style={{color:'#0D5BF1', fontSize: "13px"}}><b>Status</b></label> */}
                        {/* classNăe="feild cold" */}
                        <div className={cx('grid-container')}>
                            {/* <div class={cx('grid-item')}>
                            <RadioButton
                                inputId="category1"
                                name="status"
                                value=""
                                onChange={onCategoryChange}
                                checked={bill.job === 'Manager'}
                            />
                            <label htmlFor="Manager" style={{color:'#0D5BF1'}}>Manager</label>
                            
                        </div> */}
                            {/* <div class={cx('grid-item')}>
                            <RadioButton
                                inputId="category2"
                                name="job"
                                value="Staff"
                                onChange={onCategoryChange}
                                checked={bill.job === 'Staff'}
                            />
                            <label htmlFor="Staff"style={{color:'#0D5BF1'}}>Staff</label>
                        </div> */}
                            {/* <div class={cx('grid-item')}>
                            <RadioButton
                                inputId="category3"
                                name="job"
                                value="Specialist doctor"
                                onChange={onCategoryChange}
                                checked={bill.job === 'Specialist doctor'}
                            />
                            <label htmlFor="Specialist doctor"style={{color:'#0D5BF1'}}>Specialist doctor</label>
                        </div> */}
                            {/* <div class={cx('grid-item')}>
                            <RadioButton
                                inputId="category4"
                                name="job"
                                value="General doctor"
                                onChange={onCategoryChange}
                                checked={bill.job === 'General doctor'}
                            />
                            <label htmlFor="General doctor"style={{color:'#0D5BF1'}}>General doctor</label>
                        </div> */}
                            {/* className="field-radiobutton col-6" */}
                            {/* <div class={cx('grid-item')}>
                            <RadioButton
                                inputId="category5"
                                name="job"
                                value="Pharmacist"
                                onChange={onCategoryChange}
                                checked={bill.job === 'Pharmacist'}
                            />
                            <label htmlFor="Pharmacist"style={{color:'#0D5BF1'}}>Pharmacist</label>
                        </div> */}
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
                >
                    <div>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#153AFF' }} />
                        {product && (
                            <span /*style="font-size:10px"*/>
                                Are you sure you want to delete <b>{product.name}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteProductsDialog}
                    style={{ width: '450px' }}
                    header="Confirm"
                    modal
                    // footer={deleteProductsDialogFooter}
                    onHide={hideDeleteProductsDialog}
                >
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {product && <span>Are you sure you want to delete the selected drugs?</span>}
                    </div>
                </Dialog>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        </div>
    );
}

export default ManagerBill;
