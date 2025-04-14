import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';



/**
 * Here permission check for user is done. In the routes.ts file we can define what permissions to check for.
 * It should be written as an array in the following format.
 * Example:
 * {
 *     path: 'admin',
 *     component: AdminComponent,
 *     canActivate: [PermissionCheckRouteGuard],
 *     data: {
 *         permission: ['ADMIN', 'SUPERUSER']
 *     }
 * }
 * */
@Injectable()
export class PermissionCheckRouteGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authService.hasPermission(route.data['permission']);
        const requiredPermission = route.data['permission'];

        if (this.authService.hasPermission(requiredPermission)) {
            return true;
        }

        // Send to Access Denied page
        return this.router.parseUrl('/access-denied');
    }

}
