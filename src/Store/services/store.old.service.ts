

import {
    FetchStoreRespo,
    CreateStoreRespo,
    EditStoreRespo,
    RemoveStoreRespo
} from '../respositories/store.old.respositories';

import { FixRequestFormat } from '../utils';

import {
    CheckDataStructure,
} from '../validation';

import Supplier from '@Helper/Supplier';

export const FetchStoreService = async (request: any): Promise<any> => {
    try {
        console.log('FetchStoreService', request);

        // Check Data Structure
        const validData = await CheckDataStructure(request);
        // console.log('* Valid Data Structure : ', validDataStructure);

        // const supplierData = await Supplier({ ...validData, feature: 'fetch' });

        // if (!supplierData.where || !supplierData.store) {
        //     console.log('[Supplier Error] (Fetch) : Invalid Data Structure!!');
        //     throw { kind: 'invalid_data_structure' };
        // }

        // const { where, store } = supplierData;

        const { where, store } = validData;

        const fixedFormat = await FixRequestFormat(where);
        // console.log('Fixed (Fetch) : ', fixedFormat);

        const response = await FetchStoreRespo(store, fixedFormat);
        // console.log('FetchStoreService', response);

        return response;
    } catch (error) {
        console.log('FetchStoreService (Error):', error);
        throw error;
    }
}


export const CreateStoreService = async (request: string): Promise<any> => {
    try {
        console.log('CreateStoreService', request);

        // Check Data 
        const validData = await CheckDataStructure(request);
        // console.log('* Valid Data  : ', validData);

        const supplierData = await Supplier({ ...validData, feature: 'create' });
        // console.log('supplierData : ', supplierData);

        if (!supplierData.set || !supplierData.store) {
            console.log('[Supplier Error] (Create) : Invalid Data Structure!!');
            throw { kind: 'invalid_data_structure' };
        }

        const { set, store } = supplierData;

        const fixedFormat = await FixRequestFormat(set);
        // console.log('Fixed (Fetch) : ', fixedFormat);

        const response = await CreateStoreRespo(store, fixedFormat);
        // console.log('CreateStoreService', response);

        return response;
    } catch (error) {
        console.log('CreateStoreService (Error):', error);
        throw error;
    }
}


export const EditStoreService = async (request: string): Promise<any> => {
    try {
        console.log('EditStoreService', request);

        // Check Data 
        const validData = await CheckDataStructure(request);
        // console.log('* Valid Data  : ', validData);

        const supplierData = await Supplier({ ...validData, feature: 'edit' });

        if (!supplierData.set || !supplierData.where || !supplierData.store) {
            console.log('[Supplier Error] (Edit) : Invalid Data Structure!!');
            throw { kind: 'invalid_data_structure' };
        }

        const { set, where, store } = supplierData;

        const fixedFormat = await FixRequestFormat(where);
        // console.log('Fixed (Fetch) : ', fixedFormat);

        const response = await EditStoreRespo(store, set, fixedFormat);
        // console.log('EditStoreService', response);

        return { ...response, store: store };
    } catch (error) {
        console.log('EditStoreService (Error):', error);
        throw error;
    }
}


export const RemoveStoreService = async (request: string): Promise<any> => {
    try {
        console.log('RemoveStoreService', request);

        // Check Data 
        const validData = await CheckDataStructure(request);
        // console.log('* Valid Data  : ', validData);

        const supplierData = await Supplier({ ...validData, feature: 'remove' });

        if (!supplierData.where || !supplierData.store) {
            console.log('[Supplier Error] (Remove) : Invalid Data Structure!!');
            throw { kind: 'invalid_data_structure' };
        }

        const { where, store } = supplierData;

        const fixedFormat = await FixRequestFormat(where);
        // console.log('Fixed (Fetch) : ', fixedFormat);

        const response = await RemoveStoreRespo(store, fixedFormat);
        // console.log('RemoveStoreService', response);

        return { ...response, store: store };
    } catch (error) {
        console.log('RemoveStoreService (Error):', error);
        throw error;
    }
}