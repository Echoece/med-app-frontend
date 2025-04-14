import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


/**
 * This interceptor adds the language header for each request.
 * */
@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const lang = localStorage.getItem('lang') || 'en';
        const cloned = req.clone({
            setHeaders: { 'Accept-Language': lang }
        });
        return next.handle(cloned);
    }
}
