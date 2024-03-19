import * as httpRequest from '@/utils/httpRequest';

export const getAccountList = async () => {
    try {
        const res = await httpRequest.get('accounts/getlist', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createAccount = async (account) => {
    try {
        const res = await httpRequest.post('accounts/create', account);

        return res;
    } catch (error) {
        console.log(error);
    }
};
export const updateAccount = async (account, _id) => {
    try {
        const res = await httpRequest.put(`accounts/update/${_id}`, account);

        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteAccount = async (_id) => {
    try {
        const res = await httpRequest.deleted(`accounts/delete/${_id}`);

        return res;
    } catch (error) {
        console.log(error);
    }
};
export const deleteSelectedAccount = async (idList = []) => {
    try {
        const res = await httpRequest.post(`accounts/delete/selected`, idList);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getCounterAccount = async () => {
    try {
        const res = await httpRequest.get('accounts/counter/account', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const login = async (account) => {
    try {
        const res = await httpRequest.post('accounts/login', account);

        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getcountMana = async () => {
    try {
        const res = await httpRequest.get('accounts/count/mana', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getcountGeneral = async () => {
    try {
        const res = await httpRequest.get('accounts/count/ger', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getcountSpecial = async () => {
    try {
        const res = await httpRequest.get('accounts/count/special', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getcountStaff = async () => {
    try {
        const res = await httpRequest.get('accounts/count/sta', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getcountPha = async () => {
    try {
        const res = await httpRequest.get('accounts/count/pha', {});
        return res;
    } catch (error) {
        console.log(error);
    }
};
