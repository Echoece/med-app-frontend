import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';



/**
 * This guards check if the user is logged in or not.
 *
 * */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

        return this.authService.user$.pipe(
            take(1), // Take the latest user value and complete
            map(user => {
                const isAuthenticated = !!user;

                if (isAuthenticated) {
                    return true; // Allow access
                }

                // Redirect to login page with return URL
                return this.router.createUrlTree(
                    ['/auth/login'],
                    { queryParams: { returnUrl: state.url } }
                );
            })
        );
    }

}
