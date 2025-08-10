import { IMyRequestData } from "@SRC/Helper/Model/global.model";
import { createEmployeeHolidaysRequestPreset } from "@SRC/QuickServe/presets/employeeHolidays.preset";
import StoreService from "@SRC/Store/services";



const GetRandomEmployee = async (): Promise<{ selected: string[], notSelected: string[] }> => {
    try {
        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "employees",
            field_list: ["emp_id"]
        };

        const response = await StoreService(payload, 'fetch');
        console.log('GetRandomEmployee (response) : ', response);

        const amount = Math.round(response.length / 2);
        console.log('GetRandomEmployee (amount) : ', amount);

        // สุ่มสลับ
        const shuffled = response.sort(() => 0.5 - Math.random());

        // แบ่งเป็นสองกลุ่ม
        const selected = shuffled.slice(0, amount).map((emp: { emp_id: string }) => emp.emp_id);
        const notSelected = shuffled.slice(amount).map((emp: { emp_id: string }) => emp.emp_id);

        console.log('GetRandomEmployee (selected) : ', selected);
        console.log('GetRandomEmployee (notSelected) : ', notSelected);

        return {
            selected,
            notSelected
        };
    } catch (error) {
        throw error;
    }
}


const GetHolidays = async (today: string, type: "start" | "end"): Promise<any> => {
    try {
        const todayMD = today.slice(5);
        const field = type === "start" ? "holiday_start_date" : "holiday_end_date";

        const whereCondition: any = {};
        whereCondition[field] = `2025-${todayMD}`;
        // whereCondition[field] = "2025-01-01";

        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "holidays",
            field_list: "*",
            where: whereCondition
        };

        const response = await StoreService(payload, 'fetch');
        console.log(`GetHolidays (${type}) (response) : `, response);

        return response;
    } catch (error) {
        console.log(`GetHolidays (${type}) (Error):`, error);
    }
}

import { subDays, format } from 'date-fns';

export const CheckAndHandleEndHoliday = async (): Promise<any> => {
    try {
        const today = new Date();
        const checkDate = format(subDays(today, 1), 'yyyy-MM-dd');
        // const checkDate = "2025-01-01";

        const endHolidays = await GetHolidays(checkDate, "end");
        if (endHolidays && endHolidays.length > 0) {
            console.log('End Holidays Found:', endHolidays);

            await DeleteEmployeeHolidays(endHolidays[0].holiday_id);
        }
    } catch (error) {
        console.log('CheckAndHandleEndHoliday (Error):', error);
    }
}



const DeleteEmployeeHolidays = async (holidayId: number): Promise<any> => {
    try {
        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "employee_holidays",
            where: { holiday_id: holidayId }
        };

        const response = await StoreService(payload, 'delete');
        console.log('DeleteEmployeeHolidays (response) : ', response);
    } catch (error) {
        console.log('DeleteEmployeeHolidays (Error):', error);
    }
}





const GetEmployeeHolidays = async (): Promise<any> => {
    try {
        const payload: IMyRequestData = {
            db_type: "mysql",
            store_code: "employee_holidays",
            field_list: "*",
            limit: 1
        };

        const response = await StoreService(payload, 'fetch');
        console.log('GetEmployeeHolidays (response) : ', response);

        return response;
    } catch (error) {
        console.log('GetEmployeeHolidays (Error):', error);
    }
}



export const CheckStartHolidayAndSet = async (): Promise<any> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // const today = "2025-01-01";

        const empHolidays = await GetEmployeeHolidays();
        if (empHolidays && empHolidays.length > 0) {
            console.log('Employee Holidays Found:', empHolidays);
            return;
        }

        const holidays = await GetHolidays(today, "start");
        if (!holidays) {
            console.log('No Holidays Found !');
            return;
        }

        await RandomAndCreateEmployeeHolidays(holidays[0]);
    } catch (error) {
        console.log('CheckStartHolidayAndSet (Error):', error);
    }
}

const MixSetPayload = (empIdKey: any, holidays: any): any[] => {
    let setPayload: any = [];

    empIdKey.selected.forEach((empId: number) => {
        setPayload.push({
            emp_id: empId,
            holiday_id: holidays.holiday_id,
            reason: "Festival's Day",
            approved_by: "system"
        });
    });

    empIdKey.notSelected.forEach((empId: number) => {
        setPayload.push({
            emp_id: empId,
            holiday_id: holidays.holiday_id + 1,
            reason: "Festival's Day",
            approved_by: "system"
        });
    });

    console.log('MixSetPayload (setData) : ', setPayload);

    return setPayload;
}


export const RandomAndCreateEmployeeHolidays = async (holidays: any): Promise<any> => {
    try {
        const empIdKey = await GetRandomEmployee();
        console.log('CreateEmployeeHolidays (setData) : ', empIdKey);

        const setPayload = MixSetPayload(empIdKey, holidays);
        console.log('CreateEmployeeHolidays (setPayload) : ', setPayload);

        console.log('CreateEmployeeHolidays -> Started!', holidays);

        const preset = createEmployeeHolidaysRequestPreset(setPayload);
        console.log('CreateEmployeeHolidays (preset) : ', preset);

        const response = await StoreService(preset, 'create');
        console.log('CreateEmployeeHolidays (response) : ', response);
    } catch (error: any) {
        console.log('CreateEmployeeHolidays (Error):', error);
    }
};