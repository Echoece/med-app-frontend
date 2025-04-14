import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) {}

    get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
        return this.http.get<T>(this.baseUrl + url, { params, headers });
    }

    post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.post<T>(this.baseUrl + url, body, { headers });
    }

    put<T>(url: string, body: any,  headers?: HttpHeaders): Observable<T> {
        return this.http.put<T>(this.baseUrl + url, body, { headers });
    }

    patch<T>(url: string, body: any,  headers?: HttpHeaders): Observable<T> {
        return this.http.patch<T>(this.baseUrl + url, body, { headers });
    }

    delete<T>(url: string,  headers?: HttpHeaders): Observable<T> {
        return this.http.delete<T>(this.baseUrl + url, { headers });
    }

}
