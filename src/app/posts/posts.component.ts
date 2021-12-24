/* eslint-disable @typescript-eslint/indent */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IUserListItem } from 'src/app/posts/models/user.model';
import { IPost, IPostCommentListItem, IPostListItem } from './models/post.model';
import { PostsService } from './posts.service';

@UntilDestroy()
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  public posts$!: Observable<IPost[] | null>;
  public isList = true;

  constructor(private postsService: PostsService, private router: Router) {
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
        // map comments and user to post

        return res.posts.map((post: IPostListItem) => {
          const mappedPost: IPost = {
            ...post,
            comments: res.comments.filter((comment: IPostCommentListItem) => comment.postId === post.id),
            user: res.users.find((user: IUserListItem) => user.id === post.userId),
          };
          return mappedPost;
        }) as IPost[];
      }),
      tap((res) => console.log('res', res)),
      catchError((error: HttpErrorResponse) => of(null))
    );
  }
  changeLayout(): void {
    this.isList = !this.isList;
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
