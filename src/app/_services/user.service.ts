import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination.model';
import { User } from '../_models/user.model';
import { Observable } from 'rxjs';

export interface GetUsersQuery {
  page: number;
  pageSize: number;
  search?: string;
}
export interface UpdateBlockUsersRequest {
  ids: string[];
  block: boolean;
}
export interface DeleteUsersRequest {
  ids: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'users';

  getUsers(query: GetUsersQuery): Observable<PaginatedResult<User>> {
    let params = new HttpParams()
      .set('Page', query.page.toString())
      .set('PageSize', query.pageSize.toString());

    if (query.search) {
      params = params.set('Search', query.search);
    }

    return this.http.get<PaginatedResult<User>>(this.apiUrl, {
      params,
      withCredentials: true,
    });
  }
  blockUsers(ids: string[]): Observable<void> {
    return this.updateBlockUsers(ids, true);
  }
  unblockUsers(ids: string[]): Observable<void> {
    return this.updateBlockUsers(ids, false);
  }
  deleteUsers(ids: string[]): Observable<void> {
    return this.http.request<void>('delete', `${this.apiUrl}/delete`, {
      body: { ids } as DeleteUsersRequest,
      withCredentials: true,
    });
  }
  private updateBlockUsers(ids: string[], block: boolean): Observable<void> {
    const body: UpdateBlockUsersRequest = { ids, block };
    return this.http.post<void>(`${this.apiUrl}/update-block`, body, {
      withCredentials: true,
    });
  }
}
