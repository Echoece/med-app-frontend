import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorInterceptor } from './app/core-modules/interceptor/httpError.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/core-modules/interceptor/auth.interceptor';
import { LanguageInterceptor } from './app/core-modules/interceptor/language.interceptor';
import { LoggerInterceptor } from './app/core-modules/interceptor/logger.interceptor';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`,
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LanguageInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoggerInterceptor,
            multi: true
        }
    ]
})
export class AppComponent {}
