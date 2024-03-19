import * as httpRequest from '@/utils/httpRequest';

export const getMEFormList = async () => {
    try {
        const res = await httpRequest.get('meform/getlist');
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createMEForm = async (meform) => {
    try {
        const res = await httpRequest.post('meform/create', meform);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateMEForm = async (meform, _id) => {
    try {
        const res = await httpRequest.put(`meform/update/${_id}`, meform);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteMEForm = async (_id) => {
    try {
        const res = await httpRequest.deleted(`meform/delete/${_id}`);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteSelectedMEForm = async (idList = []) => {
    try {
        const res = await httpRequest.post(`meform/delete/selected`,idList);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getCounterMEForm = async () => {
    try {
        const res = await httpRequest.get('meform/counter/form');
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getRoomsToForm = async () => {
    try {
        const res = await httpRequest.get('room/getlist');
        return res;
    } catch (error) {
        console.log(error);
    }
};

