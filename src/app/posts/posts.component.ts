/* eslint-disable @typescript-eslint/indent */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IUserListItem } from 'src/app/posts/models/user.model';
import { PostsStateService } from 'src/app/posts/posts-state.service';
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

  onSearchChange(data: IPost[]) {
    this.posts$ = of(data);
  }

  onItemSelect(id: string | number) {
    console.log('item selected', event);
    /*   this.router.navigate([]).then((result) => {
      window.open(`/posts/detail/${id}`, '_blank');
    }); */
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
