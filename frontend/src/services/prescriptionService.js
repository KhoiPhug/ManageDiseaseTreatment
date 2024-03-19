import * as httpRequest from '@/utils/httpRequest';

export const getPrescriptionByFormId = async (formId) => {
    try {
        const res = await httpRequest.get(`/prescription/getPrescription/${formId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updatePrescription = async (prescription, prescriptionId) => {
    try {
        const res = await httpRequest.put(`prescription/update/${prescriptionId}`, prescription);
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// export const createExam = async (exam) => {
//     try {
//         const res = await httpRequest.post(`exam/create`, exam);
//         // console.log('res', res);
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const updateExam = async (exam, _id) => {
//     try {
//         const res = await httpRequest.put(`exam/update/${_id}`, exam);
//         // console.log('res', res);
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const getListToSpecForm = async () => {
//     try {
//         const res = await httpRequest.get('persons/getlisttospecform');
//         return res;
//     } catch (error) {
//         console.log(error);
//     }
// };
