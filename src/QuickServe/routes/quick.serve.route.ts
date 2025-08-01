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
    CreateLeaveDetail,
    ApproveLeaveDetail,
    AddDeduction,
    GetOneWorkRecord,
    GetAllWorkRecord,
    GetOneLeaveDetail,
    GetAllLeaveDetail,
    AddBonus,
    GetOneBonus,
    GetAllBonus,
    GetOneDeduction,
    GetAllDeduction,
    AddPosition,
    AddDepartment
} from '../serveses';



/**
 * Registers all QuickServe-related routes to the provided Express Router instance.
 * Each route has rate limiting and JWT verification enabled.
 *
 * @param {Router} router - An instance of Express Router to attach the QuickServe routes to.
 * @returns {Router} - The modified router with QuickServe routes registered.
 */

const quickServeRoutes = (router: Router): Router => {
    // console.log('Store routes');

    // My Data
    router.get('/quickserve/getMe/:userId', JwtVerifyToken, GetMe);

    // Employee Salary Counter
    router.get('/quickserve/employee/salary-counter', JwtVerifyToken, GetAllSalaryCounter);
    router.get('/quickserve/employee/:empId/salary-counter', JwtVerifyToken, GetOneSalaryCounter);

    // Work Record
    router.post('/quickserve/employee/work-record/start', JwtVerifyToken, StartWorkRecord);
    router.patch('/quickserve/employee/:empId/work-record/end', JwtVerifyToken, EndWorkRecord);
    router.get('/quickserve/employee/:empId/work-record/:workRecordState/:approveState', JwtVerifyToken, GetOneWorkRecord);
    router.get('/quickserve/employee/work-record/:workRecordState/:approveState', JwtVerifyToken, GetAllWorkRecord);

    // Level Details
    router.post('/quickserve/employee/leave-detail/add', JwtVerifyToken, CreateLeaveDetail);
    router.patch('/quickserve/employee/:empId/leave-detail', JwtVerifyToken, ApproveLeaveDetail);
    router.get('/quickserve/employee/:empId/leave-detail/:leaveState', JwtVerifyToken, GetOneLeaveDetail);
    router.get('/quickserve/employee/leave-detail/:leaveState', JwtVerifyToken, GetAllLeaveDetail);

    // Position
    router.post('/quickserve/position/add', JwtVerifyToken, AddPosition);
    router.get('/quickserve/position', JwtVerifyToken, GetAllPosition);
    router.get('/quickserve/position/:posId', JwtVerifyToken, GetOnePosition);

    // Department
    router.post('/quickserve/department/add', JwtVerifyToken, AddDepartment);
    router.get('/quickserve/department', JwtVerifyToken, GetAllDepartment);
    router.get('/quickserve/department/:depId', JwtVerifyToken, GetOneDepartment);

    // Deduction
    router.post('/quickserve/employee/deduction/add', JwtVerifyToken, AddDeduction);
    router.get('/quickserve/employee/:empId/deduction', JwtVerifyToken, GetOneDeduction);
    router.get('/quickserve/employee/deduction', JwtVerifyToken, GetAllDeduction);

    // Bonus
    router.post('/quickserve/employee/bonus/add', JwtVerifyToken, AddBonus);
    router.get('/quickserve/employee/:empId/bonus', JwtVerifyToken, GetOneBonus);
    router.get('/quickserve/employee/bonus', JwtVerifyToken, GetAllBonus);

    // Employee
    router.post('/quickserve/employee/add', JwtVerifyToken, CreateOneEmployee);
    router.get('/quickserve/employee/:empId', JwtVerifyToken, GetOneEmployee);
    router.get('/quickserve/employee', JwtVerifyToken, GetAllEmployee);

    return router;
}

export default quickServeRoutes;