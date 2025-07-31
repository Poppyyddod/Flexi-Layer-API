import { Router } from 'express';
import { JwtVerifyToken } from '@Helper/Middlewares';
import {
    GetAllSalaryCounter,
    GetOneSalaryCounter,
    GetAllEmployee,
    GetOneEmployee,
    GetAllPosition,
    GetOnePosition,
    GetAllDepartment,
    GetOneDepartment,
    GetMe,
    CreateOneEmployee,
    EndWorkRecord,
    StartWorkRecord,
    LeaveWorkRecord,
    ApproveLeaveWorkRecord,
    AddDeduction,
    GetOneWorkRecord,
    GetAllWorkRecord
} from '../serveses';

/**
 * @function storeRoutes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Store
 * @param router - express router
 * @returns express || route
 */

const quickServeRoutes = (router: Router) => {
    // console.log('Store routes');

    // My Data
    router.get('/quickserve/getMe/:userId', JwtVerifyToken, GetMe);

    // Employee Salary Counter
    router.get('/quickserve/employee/salary-counter', JwtVerifyToken, GetAllSalaryCounter);
    router.get('/quickserve/employee/:empId/salary-counter', JwtVerifyToken, GetOneSalaryCounter);

    // Work Record
    router.post('/quickserve/employee/work-record/start', JwtVerifyToken, StartWorkRecord);
    router.patch('/quickserve/employee/:empId/work-record/end', JwtVerifyToken, EndWorkRecord);
    router.post('/quickserve/employee/work-record/leave', JwtVerifyToken, LeaveWorkRecord);
    router.patch('/quickserve/employee/:empId/work-record/approve', JwtVerifyToken, ApproveLeaveWorkRecord);
    router.get('/quickserve/employee/:empId/work-record/:workRecordState/:approveState', JwtVerifyToken, GetOneWorkRecord);
    router.get('/quickserve/employee/work-record/:workRecordState/:approveState', JwtVerifyToken, GetAllWorkRecord);

    // Employee
    router.get('/quickserve/employee', JwtVerifyToken, GetAllEmployee);
    router.get('/quickserve/employee/:empId', JwtVerifyToken, GetOneEmployee);
    router.post('/quickserve/employee/add', JwtVerifyToken, CreateOneEmployee);

    // Position
    router.get('/quickserve/position', JwtVerifyToken, GetAllPosition);
    router.get('/quickserve/position/:posId', JwtVerifyToken, GetOnePosition);

    // Department
    router.get('/quickserve/department', JwtVerifyToken, GetAllDepartment);
    router.get('/quickserve/department/:depId', JwtVerifyToken, GetOneDepartment);

    // Deduction
    router.post('/quickserve/deduction/add', JwtVerifyToken, AddDeduction);

    return router;
}

export default quickServeRoutes;