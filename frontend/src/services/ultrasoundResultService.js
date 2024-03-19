import * as httpRequest from '@/utils/httpRequest';

export const getUltrasoundResultBySpecFormId = async (specFormId) => {
    try {
        const res = await httpRequest.get(`ultrasoundResult/getUltrasoundResult/${specFormId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createUltrasoundResult = async (ultrasoundResult) => {
    try {
        const res = await httpRequest.post(`ultrasoundResult/create`, ultrasoundResult);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateUltrasoundResult = async (ultrasoundResult, _id) => {
    try {
        const res = await httpRequest.put(`ultrasoundResult/update/${_id}`, ultrasoundResult);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// export const getListToSpecForm = async () => {
//     try {
//         const res = await httpRequest.get('persons/getlisttospecform');
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };
