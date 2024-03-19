import * as httpRequest from '@/utils/httpRequest';

export const getDrugList= async () => {
    try {
        const res = await httpRequest.get('drugs/getlist', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createDrug= async (drug) => {
    try {
        const res = await httpRequest.post('drugs/create',drug);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const updateDrug= async (drug,_id) => {
    try {
        const res = await httpRequest.put(`drugs/update/${_id}`,drug);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteDrug= async (_id) => {
    try {
        const res = await httpRequest.deleted(`drugs/delete/${_id}`);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteSelectedDrug = async (idList = []) => {
    try {
        const res = await httpRequest.post(`drugs/delete/selected`,idList);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getCounterDrug= async () => {
    try {
        const res = await httpRequest.get('drugs/counter/drug', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};