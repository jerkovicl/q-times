import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IPost, IPostCommentListItem, IPostListItem } from 'src/app/posts/models/post.model';
import { IUserListItem } from 'src/app/posts/models/user.model';
import { PostsStateService } from 'src/app/posts/posts-state.service';
import { PostsService } from './../../posts.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit, OnDestroy {
  public post$!: Observable<IPost | null>;
  constructor(
    private postsService: PostsService,
    private postsStateService: PostsStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // pull from state
      /*   this.post$ = this.postsStateService.getPosts().pipe(
        map((posts: IPost[]) => {
          return posts.filter((post: IPost) => post.id === +id)[0];
        })
      ); */

      this.getData(id);
    }
  }
  getData(id: string): void {
    const post$: Observable<IPostListItem> = this.postsService
      .get<IPostListItem>('posts', id)
      .pipe(catchError((error) => of(error)));
    const comments$: Observable<IPostCommentListItem[]> = this.postsService
      .getList<IPostCommentListItem>('comments')
      .pipe(catchError((error) => of(error)));
    const users$: Observable<IUserListItem[]> = this.postsService
      .getList<IUserListItem>('users')
      .pipe(catchError((error) => of(error)));
    this.post$ = forkJoin({
      post: post$,
      comments: comments$,
      users: users$,
    }).pipe(
      map((res) => {
        // map comments and user to post

        const mappedPost: IPost = {
          ...res.post,
          comments: res.comments.filter((comment: IPostCommentListItem) => comment.postId === res.post.id),
          user: res.users.find((user: IUserListItem) => user.id === res.post.userId),
        };
        return (res.post = { ...mappedPost });
      }),
      tap((res) => {
        console.log('post item', res);
      }),
      catchError((error: HttpErrorResponse) => of(null))
    );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
