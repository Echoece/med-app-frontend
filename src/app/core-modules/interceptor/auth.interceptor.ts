import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * This interceptor adds Authorization header for each request if a token is available.
 * */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    /* TODO: implement logic to handle different token for different backend service calling,
        maybe have a list of services and have a custom header sent (for example, service: google), check for that header
        and add token or authentication accordingly.
        */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (token) {
            const clonedRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
            });

            return next.handle(clonedRequest);
        }

        return next.handle(req);
    }

}

