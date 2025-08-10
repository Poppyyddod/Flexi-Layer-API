import { Router } from 'express';
import { JwtVerifyToken } from '@Helper/Middlewares';
import { GetAllEmployeeAuth, GetMe } from '../serveses/my_data';
import { CreateOneEmployee, DeleteOneEmployee, GetAllEmployee, GetAllSalaryCounter, GetOneEmployee, GetOneSalaryCounter, UpdateEmployee } from '../serveses/employee';
import { DeleteOneWorkRecord, EndWorkRecord, GetAllWorkRecord, GetOneWorkRecord, StartWorkRecord } from '../serveses/work_record';
import { ApproveLeaveDetail, CreateLeaveDetail, DeleteOneLeaveDetail, GetAllLeaveDetail, GetOneLeaveDetail } from '../serveses/leave_detail';
import { AddPosition, DeleteOnePosition, GetAllPosition, GetOnePosition, UpdatePosition } from '../serveses/position';
import { AddDepartment, DeleteOneDepartment, GetAllDepartment, GetOneDepartment, UpdateDepartment } from '../serveses/department';
import { AddDeduction, DeleteOneDeduction, GetAllDeduction, GetOneDeduction, UpdateDeduction } from '../serveses/deduction';
import { AddBonus, DeleteOneBonus, GetAllBonus, GetOneBonus, UpdateBonus } from '../serveses/bonus';
import { PayOneSalary } from '../serveses/resetSalary.serve';
import { GetAllEmployeeHolidays, GetOneEmployeeHolidays } from '../serveses/employee_holidays';




/**
 * Registers all QuickServe-related routes to the provided Express Router instance.
 * Each route has rate limiting and JWT verification enabled.
 *
 * @param {Router} router - An instance of Express Router to attach the QuickServe routes to.
 * @returns {Router} - The modified router with QuickServe routes registered.
 */

const quickServeRoutes = (router: Router): Router => {
    // console.log('Store routes');

    // Pay Salary
    router.post('/quickserve/employee/salary/pay', JwtVerifyToken, PayOneSalary);

    // Work Record
    router.delete('/quickserve/employee/work-record/:workId/delete', JwtVerifyToken, DeleteOneWorkRecord);
    router.patch('/quickserve/employee/:empId/work-record/end', JwtVerifyToken, EndWorkRecord);
    router.post('/quickserve/employee/work-record/start', JwtVerifyToken, StartWorkRecord);
    router.get('/quickserve/employee/:empId/work-record/:workRecordState/:approveState', JwtVerifyToken, GetOneWorkRecord);
    router.get('/quickserve/employee/work-record/:workRecordState/:approveState', JwtVerifyToken, GetAllWorkRecord);

    // Level Details
    router.delete('/quickserve/employee/leave-detail/:leaveDetailId/delete', JwtVerifyToken, DeleteOneLeaveDetail);
    router.patch('/quickserve/employee/:empId/leave-detail', JwtVerifyToken, ApproveLeaveDetail);
    router.post('/quickserve/employee/leave-detail/add', JwtVerifyToken, CreateLeaveDetail);
    router.get('/quickserve/employee/:empId/leave-detail/:leaveState', JwtVerifyToken, GetOneLeaveDetail);
    router.get('/quickserve/employee/leave-detail/:leaveState', JwtVerifyToken, GetAllLeaveDetail);

    // Position
    router.delete('/quickserve/position/:posId/delete', JwtVerifyToken, DeleteOnePosition);
    router.patch('/quickserve/position/:posId/update', JwtVerifyToken, UpdatePosition);
    router.post('/quickserve/position/add', JwtVerifyToken, AddPosition);
    router.get('/quickserve/position', JwtVerifyToken, GetAllPosition);
    router.get('/quickserve/position/:posId', JwtVerifyToken, GetOnePosition);

    // Department
    router.delete('/quickserve/department/:depId/delete', JwtVerifyToken, DeleteOneDepartment);
    router.patch('/quickserve/department/:depId/update', JwtVerifyToken, UpdateDepartment);
    router.post('/quickserve/department/add', JwtVerifyToken, AddDepartment);
    router.get('/quickserve/department', JwtVerifyToken, GetAllDepartment);
    router.get('/quickserve/department/:depId', JwtVerifyToken, GetOneDepartment);

    // Deduction
    router.delete('/quickserve/employee/deduction/:dedId/delete', JwtVerifyToken, DeleteOneDeduction);
    router.patch('/quickserve/employee/deduction/:dedId/update', JwtVerifyToken, UpdateDeduction);
    router.post('/quickserve/employee/deduction/add', JwtVerifyToken, AddDeduction);
    router.get('/quickserve/employee/:empId/deduction', JwtVerifyToken, GetOneDeduction);
    router.get('/quickserve/employee/deduction', JwtVerifyToken, GetAllDeduction);

    // Bonus
    router.delete('/quickserve/employee/bonus/:bonusId/delete', JwtVerifyToken, DeleteOneBonus);
    router.patch('/quickserve/employee/bonus/:bonusId/update', JwtVerifyToken, UpdateBonus);
    router.post('/quickserve/employee/bonus/add', JwtVerifyToken, AddBonus);
    router.get('/quickserve/employee/:empId/bonus', JwtVerifyToken, GetOneBonus);
    router.get('/quickserve/employee/bonus', JwtVerifyToken, GetAllBonus);

    // My Data
    router.get('/quickserve/getMe/:userId', JwtVerifyToken, GetMe);

    // Employee Holidays
    router.get('/quickserve/employee/holidays', JwtVerifyToken, GetAllEmployeeHolidays);
    router.get('/quickserve/employee/:empId/holidays', JwtVerifyToken, GetOneEmployeeHolidays);

    // Employee Salary Counter
    router.get('/quickserve/employee/salary-counter', JwtVerifyToken, GetAllSalaryCounter);
    router.get('/quickserve/employee/:empId/salary-counter', JwtVerifyToken, GetOneSalaryCounter);

    // Employee
    router.delete('/quickserve/employee/:empId/delete', JwtVerifyToken, DeleteOneEmployee);
    router.patch('/quickserve/employee/:empId/update', JwtVerifyToken, UpdateEmployee);
    router.post('/quickserve/employee/add', JwtVerifyToken, CreateOneEmployee);
    router.get('/quickserve/employee/auth', JwtVerifyToken, GetAllEmployeeAuth);
    router.get('/quickserve/employee/:empId', JwtVerifyToken, GetOneEmployee);
    router.get('/quickserve/employee', JwtVerifyToken, GetAllEmployee);

    return router;
}

export default quickServeRoutes;