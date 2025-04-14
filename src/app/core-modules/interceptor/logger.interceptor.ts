import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';



/**
 * this is a logger interceptor, currently we are loggin in the console. But in product a logger service db should be
 * used
 * */
@Injectable()
export class LoggerInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();

        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    const elapsed = Date.now() - started;
                    console.log(`[Logger] ${req.method} ${req.url} took ${elapsed}ms`);
                }
            })
        );
    }

}
