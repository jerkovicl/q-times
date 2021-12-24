/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from './../../environments/environment';
const headers = new HttpHeaders();

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {
    headers.set('Content-Type', 'application/json');
    // headers.set('Accept', 'application/json');
  }
  getList<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUrl}/${path}`).pipe(
      map((response: T[]) => response),
      shareReplay({ bufferSize: 0, refCount: true })
    );
  }
  get<T>(path: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${path}/${id}`);
  }
}
