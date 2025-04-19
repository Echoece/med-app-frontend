import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = environment.baseUrl + environment.urlVersion;
    constructor(private http: HttpClient) {}

    get<T>(url: string, params?: HttpParams, headers?: HttpHeaders, skipBaseUrl?: boolean ): Observable<T> {
        return this.http.get<T>(this.buildUrl(url, skipBaseUrl), { params, headers });
    }

    post<T>(url: string, body: any, headers?: HttpHeaders,  skipBaseUrl?: boolean): Observable<T> {
        return this.http.post<T>(this.buildUrl(url, skipBaseUrl), body, { headers });
    }

    put<T>(url: string, body: any,  headers?: HttpHeaders , skipBaseUrl?: boolean): Observable<T> {
        return this.http.put<T>(this.buildUrl(url, skipBaseUrl), body, { headers });
    }

    patch<T>(url: string, body: any,  headers?: HttpHeaders, skipBaseUrl?: boolean): Observable<T> {
        return this.http.patch<T>(this.buildUrl(url, skipBaseUrl), body, { headers });
    }

    delete<T>(url: string,  headers?: HttpHeaders, skipBaseUrl?: boolean): Observable<T> {
        return this.http.delete<T>(this.buildUrl(url, skipBaseUrl), { headers });
    }

    private buildUrl(url: string, skipBaseUrl?:boolean) :string {
        if (skipBaseUrl)
            return url;

        return `${this.baseUrl}${url}`;
    }

    // Centralized headers, e.g., for authorization tokens or any custom tokens
    private getDefaultHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        // Add any default headers here
        // headers = headers.set('Authorization', `Bearer ${yourToken}`);
        return headers;
    }

}
