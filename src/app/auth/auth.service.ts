import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';



interface LoginResponse {
    id: number;
    username: string;
    email: string;
    type: string;
    token: string;
    authorities: string[];
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly authURL = environment.baseUrl + environment.urlVersion +   '/auth';

    // The subject is marked private to prevent external components from directly calling .next() and bypassing your authentication logic
    private userSubject = new BehaviorSubject<LoginResponse | null>(null);

    // Exposes the BehaviorSubject as a read-only Observable.
    // Components/services can subscribe to user$ to reactively get user state updates but cannot modify the state directly.
    /* Why use asObservable():
            Prevents external code from calling .next() on the subject (encapsulation).
            Follows the principle of least privilege.*/
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient, private router: Router, private service: MessageService) {}

    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.authURL}/login`, credentials).pipe(
            tap({
                next: (response: LoginResponse) => {
                    console.log(response);
                    if (!response) {
                        throw new Error('Invalid login response');
                    }
                    this.userSubject.next(response);
                },
                error: (err) => {
                    console.log(err.error.error);
                    this.userSubject.next(null); // Clear user state on error
                    throw err; // Re-throw for error handling in components
                }
            })
        );
    }

    logout() {
        this.http.post(`${this.authURL}/logout`, {}).subscribe(() => {
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
}
