import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

// these 2 helper methods could be used for other services, but would probably need to be moved into their own file
export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {
      // our Members array will be contained in response.body
      if (response.body) {
        paginatedResult.result = response.body;
      }
      const pagination = response.headers.get('Pagination');
      //if (response.headers.get('Pagination') !== null) {
      if (pagination) {
        paginatedResult.pagination = JSON.parse(pagination);
      }
      return paginatedResult;
    })
  );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}