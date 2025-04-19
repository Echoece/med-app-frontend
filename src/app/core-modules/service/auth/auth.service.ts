import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { validateToken } from '../jwt.service';
import { LoginResponse } from '../../model/auth/auth.model';



/*
*  includes 1. login, logout, getUser,
* */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly authURL = environment.baseUrl + environment.urlVersion + '/auth';

    // The subject is marked private to prevent external components from directly calling .next() and bypassing authentication logic
    private userSubject = new BehaviorSubject<LoginResponse | null>(null);

    // Exposes the BehaviorSubject as a read-only Observable. Components/services can subscribe to user$ to reactively get
    // user state updates but cannot modify the state directly.

    /* Why use asObservable(): Prevents external code from calling .next() on the subject (encapsulation). Follows the principle of least privilege.*/
    user$ = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private service: MessageService,
    ) {

        // updates user information in service
        this.initializeUserFromStorageOnAppStart();

        // logs out from all other tabs if user logs out in one tab.
        this.listenToStorageChanges();
    }

    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.authURL}/login`, credentials).pipe(
            tap({
                next: (response: LoginResponse) => {
                    if (!response) {
                        throw new Error('Invalid login response');
                    }
                    this.addUserToLocalStorage(response);
                    this.userSubject.next(response);
                },
                error: (err) => {
                    this.removeUserDataFromLocalStorage();
                    this.userSubject.next(null); // Clear user state on error
                    throw err; // Re-throw for error handling in components
                }
            })
        );
    }



    logout() {
        this.http.post(`${this.authURL}/logout`, {}).subscribe(() => {
            this.removeUserDataFromLocalStorage();
            this.userSubject.next(null);
            this.router.navigate(['/login']);
        });
    }

    getUser(): LoginResponse | null {
        return this.userSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     *
     * Accepts array of roles to check against the user types.
     * */
    hasRole(...roles: string[]): boolean {
        const userRoles = this.getRoleNames();
        if (!userRoles) return false;

        return roles.some(role => userRoles.includes(role));
    }

    /**
     * Accepts a single permission or an array of permission, checks against the user authorities
     * */
    hasPermission(required: string | string[]): boolean {
        const user = this.getUser();
        const permissions = this.getPermissionNames();

        if (!user || !user.enabled || !user.accountNonLocked || !permissions) {
            return false;
        }

        // Normalize to array in case string value
        const requiredPermissions = Array.isArray(required) ? required : [required];

        return requiredPermissions.some(permission => permissions.includes(permission));
    }


    /* these methods adds and removes user from localstorage in browser */
    private addUserToLocalStorage(response: LoginResponse) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
    }

    private removeUserDataFromLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /* during new tab initialization and during logout clean up method */
    private initializeUserFromStorageOnAppStart(): void {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user && validateToken(token)) {
            try {
                const parsedUser: LoginResponse = JSON.parse(user);
                this.userSubject.next(parsedUser);
            } catch (e) {
                console.error('Invalid user in localStorage', e);
                this.removeUserDataFromLocalStorage();
            }
        }
    }

    private listenToStorageChanges() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'token' && !event.newValue) {
                // User logged out in another tab
                this.userSubject.next(null);
                this.router.navigate(['/login']);
            }
        });
    }

    /**
     *  This method extracts the role names from the roleList of loginResponse, and convert into an array
     * */

    private getRoleNames(): string[] | null {
        const user = this.userSubject.value;
        if (!user || !user.roleList || user.roleList.length === 0) {
            return null;
        }
        return user.roleList.map(role => role.name);
    }

    /**
     *  This method extracts the permission names from the permissionList of loginResponse, and convert into an array
     * */
    private getPermissionNames(): string[] | null {
        const user = this.userSubject.value;
        if (!user || !user.permissionList || user.permissionList.length === 0) {
            return null;
        }
        return user.permissionList.map(permission => permission.name);
    }
}


