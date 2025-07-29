import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";
import { PersonSalaryCounterRequestPreset, SalaryCounterRequestPreset } from "../presets/salaryCounter.preset";
import useSalaryCounter from "../composables/useSalaryCounter";



export const GetAllSalaryCounter = async (req: Request, res: Response) => {
    try {
        // console.log('ServeSalaryCounter : ', req.body);

        const response = await StoreService(SalaryCounterRequestPreset, 'fetch');
        console.log('ServeAllSalaryCounter (response) : ', response);

        if (response.length === 0) {
            return res.status(200).json({
                message: "No row in the table!",
                quick_serve_name: 'AllSalaryCounter',
                success: false
            });
        }

        const salary = useSalaryCounter().SummarizeSalary(response);
        console.log('ServeAllSalaryCounter (salary) : ', salary);

        res.status(200).json({
            message: "Successfully Served!",
            quick_serve_name: 'AllSalaryCounter',
            success: true,
            data: salary
        });
    } catch (error) {
        console.log("ServeAllSalaryCounter (Error) : ", error);

        res.status(500).json({
            message: "Failed to Serve!",
            quick_serve_name: 'AllSalaryCounter',
            success: false
        });
    }
}



export const GetOneSalaryCounter = async (req: Request, res: Response) => {
    try {
        // console.log('ServeSalaryCounter : ', req.body);

        const empId = req.params.empId;
        if (!empId) {
            res.status(400).json({
                message: "Param empId is required",
                quick_serve_name: 'PersonSalaryCounter',
                success: false
            });
        }

        const requestPreset = PersonSalaryCounterRequestPreset(empId);
        // console.log('ServePersonSalaryCounter (requestPreset) : ', requestPreset);

        const response = await StoreService(requestPreset, 'fetch');
        console.log('ServePersonSalaryCounter (response) : ', response);

        const salary = useSalaryCounter().SummarizeSalary(response);
        console.log('ServePersonSalaryCounter (salary) : ', salary);

        res.status(200).json({
            message: "Successfully Served!",
            quick_serve_name: 'PersonSalaryCounter',
            success: true,
            data: salary
        });
    } catch (error: any) {
        console.log("ServePersonSalaryCounter (Error) : ", error);

        if (error?.kind) {
            HandleError(res, error);
        }
    }
}


const HandleError = (res: Response, error: any) => {
    const { kind } = error;
    if (kind === "not_found_data") {
        return res.status(404).json({
            message: "Unknown employees id!",
            quick_serve_name: 'PersonSalaryCounter',
            success: false
        });
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name: 'PersonSalaryCounter',
        success: false
    });
}