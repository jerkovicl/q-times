/* eslint-disable @typescript-eslint/indent */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { IUserListItem } from 'src/app/posts/models/user.model';
import { PostsStateService } from 'src/app/posts/posts-state.service';
import { IPost, IPostCommentListItem, IPostListItem } from './models/post.model';
import { PostsService } from './posts.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  public posts$!: Observable<IPost[] | null>;
  public autocompleteItems$: BehaviorSubject<IPost[]> = new BehaviorSubject<IPost[]>([]);

  constructor(
    private postsService: PostsService,
    private postsStateService: PostsStateService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    const posts$: Observable<IPostListItem[]> = this.postsService
      .getList<IPostListItem>('posts')
      .pipe(catchError((error) => of(error)));
    const comments$: Observable<IPostCommentListItem[]> = this.postsService
      .getList<IPostCommentListItem>('comments')
      .pipe(catchError((error) => of(error)));
    const users$: Observable<IUserListItem[]> = this.postsService
      .getList<IUserListItem>('users')
      .pipe(catchError((error) => of(error)));
    this.posts$ = forkJoin({
      posts: posts$,
      comments: comments$,
      users: users$,
    }).pipe(
      map((res) => {
        // map comments and user to post and save to state
        return res.posts.map((post: IPostListItem) => {
          const mappedPost: IPost = {
            ...post,
            comments: res.comments.filter((comment: IPostCommentListItem) => comment.postId === post.id),
            user: res.users.find((user: IUserListItem) => user.id === post.userId),
          };
          return mappedPost;
        }) as IPost[];
      }),
      tap((res) => {
        console.log('res', res);
        this.postsStateService.setPosts(res);
      }),
      catchError((error: HttpErrorResponse) => of(null))
    );
  }

  onFilteredChange(data: IPost[]): void {
    this.posts$ = of(data);
  }

  onSearchChange(term: string): void {
    if (term && term.trim() != '') {
      of(term)
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => {
            //  this.autocompleteItems$.next([]);
          }),
          switchMap((value: string) =>
            forkJoin({
              filteredPosts: this.postsService.search<IPostListItem>('posts', value),
              users: this.postsService.getList<IUserListItem>('users'),
            }).pipe(
              map((res) => {
                // map comments and user to post
                return res.filteredPosts.map((post: IPostListItem) => {
                  const mappedPost: IPost = {
                    ...post,
                    comments: [],
                    user: res.users.find((user: IUserListItem) => user.id === post.userId),
                  };
                  return mappedPost;
                }) as IPost[];
              }),
              catchError((error: HttpErrorResponse) => of(null))
            )
          ),
          untilDestroyed(this)
        )
        .subscribe((data: IPost[] | null) => {
          if (!data) {
            this.autocompleteItems$.next([]);
          } else {
            this.autocompleteItems$.next(data as IPost[]);
          }
          console.log('search data', data);
        });
    }
  }

  onItemSelect(id: string | number) {
    console.log('item selected', id);
    // possibility to go to detail after selecting item from autocomplete dropdown
    /*   this.router.navigate([]).then((result) => {
      window.open(`/posts/detail/${id}`, '_blank');
    }); */
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
