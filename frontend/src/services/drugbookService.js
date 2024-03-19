import * as httpRequest from '@/utils/httpRequest';

export const getDrugBookList= async () => {
    try {
        const res = await httpRequest.get('drugbooks/getlist', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createDrugBook= async (drugbook) => {
    try {
        const res = await httpRequest.post('drugbooks/create',drugbook);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const updateDrugBook= async (drugbook,_id) => {
    try {
        const res = await httpRequest.put(`drugbooks/update/${_id}`,drugbook);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteDrugBook = async (_id) => {
    try {
        const res = await httpRequest.deleted(`drugbooks/delete/${_id}`);
        
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteSelectedDrugBook = async (idList = []) => {
    try {
        const res = await httpRequest.post(`drugbooks/delete/selected`,idList);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getCounterDrugBook= async () => {
    try {
        const res = await httpRequest.get('drugbooks/counter/drugbook', {
            
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};