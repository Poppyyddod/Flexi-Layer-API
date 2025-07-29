import { Router } from 'express';
import { JwtVerifyToken } from '@Helper/Middlewares';
import { GetAllSalaryCounter, GetOneSalaryCounter, GetAllEmployee, GetOneEmployee } from '../employees';

/**
 * @function storeRoutes - ສຳຫຼັບການກຳໜົດ Route ຂອງ Store
 * @param router - express router
 * @returns express || route
 */

const quickServeRoutes = (router: Router) => {
    // console.log('Store routes');

    // Get Employee Salary Counter
    router.get('/quickserve/employee/salary-counter', JwtVerifyToken, GetAllSalaryCounter);
    router.get('/quickserve/employee/:empId/salary-counter', JwtVerifyToken, GetOneSalaryCounter);

    // Get Employee
    router.get('/quickserve/employee', JwtVerifyToken, GetAllEmployee);
    router.get('/quickserve/employee/:empId', JwtVerifyToken, GetOneEmployee);

    return router;
}

export default quickServeRoutes;