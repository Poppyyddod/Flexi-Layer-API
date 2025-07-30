import { Router } from 'express';
import { JwtVerifyToken } from '@Helper/Middlewares';
import { GetAllSalaryCounter, GetOneSalaryCounter, GetAllEmployee, GetOneEmployee, GetAllPosition, GetOnePosition, GetAllDepartment, GetOneDepartment, GetMe, CreateOneEmployee } from '../serveses';

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

    return router;
}

export default quickServeRoutes;