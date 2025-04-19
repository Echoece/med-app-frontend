import { HttpParams } from '@angular/common/http';
import _ from 'lodash';


/**
 * If we're  passing { key: value } objects as params, we can auto-convert using this method.
 * example uses:
 * getContractsLight(opts = {}) {
 *   return this.http.get(`${this.urlBase}/light`, {
 *     params: makeParams({
 *       httpParams: this.httpOptions.params, // Existing HTTP params if any
 *       queryParams: opts // Query params passed from the component
 *     }),
 *   });
 * };
 *
 * it is used to pass queryparams during http calls, it has default pagination value of 1000000
 * */

export function makeParams(opts: { httpParams?: HttpParams, queryParams: any }) {
    // Initialize HttpParams either from existing params or a new instance
    let httpParams = opts.httpParams || new HttpParams();

    // Keys for pagination and sorting
    const paginationParamKeys = ['p_page', 'p_size'];
    const sortingParamKeys = ['p_sort', 'p_order'];

    // Extract pagination, sorting, and other parameters from queryParams
    const paginationParams = _.pick(opts.queryParams, paginationParamKeys);
    const sortingParams = _.pick(opts.queryParams, sortingParamKeys);
    const otherParams = _.omit(opts.queryParams, [...paginationParamKeys, ...sortingParamKeys]);

    // Default pagination values if not provided (to fetch all items)
    if (_.isEmpty(paginationParams)) {
        paginationParams['p_size'] = 1000000; // Big number to get all items
    }

    // Handle sorting parameters (convert to 'sort' parameter)
    if (!_.isEmpty(sortingParams)) {
        const sortVal = `${sortingParams['p_sort']},${sortingParams['p_order']}`; // 'column,asc|desc'
        httpParams = httpParams.set('sort', sortVal);
    }

    // Handle pagination parameters (convert 'p_' prefix and set the corresponding parameter)
    _.forEach(paginationParams, (value, key) => {
        const paramName = key.replace('p_', '').toLowerCase();
        httpParams = httpParams.set(paramName, String(value));
    });

    // Handle other custom parameters
    _.forEach(otherParams, (value, key) => {
        httpParams = httpParams.set(key.toLowerCase(), String(value)); // Ensure all params are lowercase
    });

    return httpParams;
}


export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
