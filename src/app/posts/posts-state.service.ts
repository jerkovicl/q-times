/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPost } from 'src/app/posts/models/post.model';

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
