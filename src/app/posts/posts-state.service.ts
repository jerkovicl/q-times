/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPost } from 'src/app/posts/models/post.model';
const headers = new HttpHeaders();

@Injectable({
  providedIn: 'root',
})
export class PostsStateService implements OnDestroy {
  private posts$ = new BehaviorSubject<Array<IPost>>([]);
  constructor() {}
  setPosts(data: Array<IPost>): void {
    this.posts$.next(data);
  }
  getPosts(): Observable<IPost[]> {
    return this.posts$.asObservable();
  }

  getPostsArray(): IPost[] {
    return this.posts$.getValue();
  }

  ngOnDestroy(): void {
    this.posts$.complete();
  }
}
