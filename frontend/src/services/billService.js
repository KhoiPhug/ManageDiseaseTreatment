import * as httpRequest from '@/utils/httpRequest';

export const getBillList= async () => {
    try {
        const res = await httpRequest.get('bills/getlist', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createBill= async (bill) => {
    try {
        const res = await httpRequest.post('bills/create',bill);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const updateBill= async (bill,_id) => {
    try {
        const res = await httpRequest.put(`bills/update/${_id}`,bill);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteBill= async (_id) => {
    try {
        const res = await httpRequest.deleted(`bills/delete/${_id}`);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteSelectedBill = async (idList = []) => {
    try {
        const res = await httpRequest.post(`bills/delete/selected`,idList);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getCounterBill= async () => {
    try {
        const res = await httpRequest.get('bills/counter/bill', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};