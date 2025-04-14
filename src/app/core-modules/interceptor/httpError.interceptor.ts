import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { MessageService } from 'primeng/api';

/**
 * This interceptor handles Http errors for HttpClient. It will show a toast message using the formatted error message.
 * And later will re throw the error in case component want to handle the error
 * */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private messageService: MessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.handleErrorResponse(error);
                return throwError(() => error);
            })
        );
    }


    private handleErrorResponse(error: HttpErrorResponse): void {
        // Handle 401 Unauthorized
        if (error.status === 401) {
            this.authService.logout();
            this.showErrorMessage('Session expired. Please login again.');
            return;
        }

        const errorMessage = this.extractErrorMessage(error);
        this.showErrorMessage(errorMessage);
    }

    /**
     * Creates Error message from response. First checks for customError.error.error.details, if it has then concats the
     * messages. If not then checks the customError.error.error.message field is used and so on. If nothing is found
     * then a fallback string is used.
     * */

    private extractErrorMessage(error: HttpErrorResponse): string {
        const customError = error.error as CustomError;

        // 1. Check for detailed field validation errors
        if (customError?.error?.error?.details?.length) {
            return customError.error.error.details
                .map(d => d.fieldName ? `${d.fieldName}: ${d.message}` : d.message)
                .join('\n');
        }

        // 2. Check for main error message
        if (customError?.error?.error?.message) {
            return customError.error.error.message;
        }

        // 3. Check for alternative error message locations
        if (customError?.error?.message) {
            return customError.error.message;
        }

        if (customError?.message) {
            return customError.message;
        }

        // 4. Fallback to HTTP status messages
        switch (error.status) {
            case 0:
                return 'Network error - please check your connection';
            case 400:
                return 'Bad request - invalid data sent';
            case 403:
                return 'Forbidden - you lack necessary permissions';
            case 404:
                return 'Resource not found';
            case 500:
                return 'Server error - please try again later';
            default:
                return error.message || 'An unexpected error occurred';
        }
    }

    /**
     * this will build a toast error message using primeNg toast. The toast component is in the layout template.
     * */
    private showErrorMessage(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000, // Display for 5 seconds
            closable: true
        });
    }
}

/**
 * error response interface - according to backend error response format.
 * */

interface CustomError {
    error?: {
        error?: {
            name : string;
            statusCode : number;
            stackTrace: string;
            message : string;
            details?: ErrorDetail[];
        };
        message?: string;
    };
    message?: string;
}


interface ErrorDetail {
    message: string;
    fieldName: string;
    value: string;
}
