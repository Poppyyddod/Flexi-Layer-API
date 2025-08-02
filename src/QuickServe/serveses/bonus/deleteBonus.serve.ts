import errorHandles from "@SRC/Helper/Data/Error";
import useTime from "@SRC/QuickServe/composables/useMySQLTime";
import { deleteOneBonusRequestPreset } from "@SRC/QuickServe/presets/bonus.preset";
import StoreService from "@SRC/Store/services";
import { Request, Response } from "express";





export const DeleteOneBonus = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log('DeleteOneBonus : ', req.params);

        const bonusId = req.params.bonusId;
        const preset = deleteOneBonusRequestPreset(bonusId);
        const response = await StoreService(preset, 'delete');

        return res.status(200).json({
            message: "Successfully DeleteOneBonus Served!",
            quick_serve_name: 'DeleteOneBonus',
            success: true,
            data: {
                affectedRows: response.affectedRows,
                deleted_at: useTime().getLocalTimeAsISOString()
            }
        });
    } catch (error: any) {
        console.log('DeleteOneBonus (Error):', error);

        if (error?.kind) {
            await errorHandles(error, res, { systemName: 'QuickServe', feature: 'DeleteOneBonus' });
        } else {
            HandleError(res, error, 'DeleteOneBonus');
        }
    }
};



const HandleError = (res: Response, error: any, quick_serve_name: string): Record<string, any> => {
    if (error?.code === "ER_NO_REFERENCED_ROW_2") {
        return NoReferenceRow2(error, res, quick_serve_name);
    }

    return res.status(500).json({
        message: "Failed to Serve!",
        quick_serve_name,
        success: false
    });
};



const NoReferenceRow2 = (error: any, res: Response, quick_serve_name: string): Record<string, any> => {
    const match = error?.sqlMessage?.match(/CONSTRAINT `(.*?)` FOREIGN KEY \(`(.*?)`\) REFERENCES `(.*?)` \(`(.*?)`\)/);
    const field = match ? match[2] : "unknown_field";
    const table = match ? match[3] : "unknown_table";
    const referencedField = match ? match[4] : "unknown_column";

    return res.status(404).json({
        message: "Invalid foreign key reference",
        read_me: "The data you are trying to link (foreign key) doesn't exist in the referenced table.",
        detail: `Field '${field}' in this request does not match any existing '${referencedField}' in the '${table}' table.`,
        quick_serve_name,
        success: false
    });
};