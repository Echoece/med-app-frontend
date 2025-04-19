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

    /*  adds authentication token in request header for each request if token exists in localstorage, in case we want to skip it,
        we can add skipAuthToken header in request, it will skip the process.
        */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has('skipAuthToken')) {
            req = req.clone({ headers: req.headers.delete('skipAuthToken') });
            return next.handle(req);
        }

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

