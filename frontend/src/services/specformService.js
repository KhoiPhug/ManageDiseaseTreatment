import * as httpRequest from '@/utils/httpRequest';

export const getSpecFormList = async () => {
    try {
        const res = await httpRequest.get('specform/getlist');
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// export const createMEForm = async (meform) => {
//     try {
//         const res = await httpRequest.post('meform/create', meform);
//         // console.log('res', res);
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };

export const updateSpecForm = async (specForm, _id) => {
    try {
        const res = await httpRequest.put(`specform/update/${_id}`, specForm);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateOverResult = async (overResult, _id) => {
    try {
        const res = await httpRequest.patch(`specform/updateOverResult`, { overResult, _id });
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteSpecForm = async (_id) => {
    try {
        const res = await httpRequest.deleted(`specform/delete/${_id}`);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteSelectedSpecForm = async (idList = []) => {
    try {
        const res = await httpRequest.post(`specform/delete/selected`, idList);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createManySpecForm = async (data) => {
    try {
        const res = await httpRequest.post('specform/createMany', data);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

////////////

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
