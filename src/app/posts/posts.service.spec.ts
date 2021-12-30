/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPostListItem } from 'src/app/posts/models/post.model';
import { posts } from 'src/app/posts/models/posts.mock';
import { environment } from 'src/environments/environment';
import { PostsService } from './posts.service';
const searchTerm = 'lauda';
const expectedUrl = `${environment.apiUrl}/posts/`;

describe('PostsService', () => {
  let service: PostsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostsService],
    });
    service = TestBed.inject(PostsService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('gets post detail', () => {
    let actualPost: IPostListItem | undefined;
    const postId = 11;

    service.get<IPostListItem>('posts', postId).subscribe((res) => {
      actualPost = res;
    });

    const request = controller.expectOne(`${expectedUrl}${postId}`);
    request.flush(posts[0]);
    controller.verify();

    expect(actualPost).toEqual(posts[0]);
  });

  it('searches for posts', () => {
    let actualPosts: IPostListItem[] | undefined;

    service.search<IPostListItem>('posts', searchTerm).subscribe((res) => {
      actualPosts = res;
    });

    const request = controller.expectOne(`${expectedUrl}?q=${searchTerm}`);
    request.flush(posts);
    controller.verify();

    expect(actualPosts).toEqual(posts);
  });

  it('passes through search errors', () => {
    const status = 500;
    const statusText = 'Server error';
    const errorEvent = new ErrorEvent('API error');

    let actualError: HttpErrorResponse | undefined;

    service.search<IPostListItem>('posts', searchTerm).subscribe(
      () => {
        fail('next handler must not be called');
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail('complete handler must not be called');
      }
    );

    controller.expectOne(`${expectedUrl}?q=${searchTerm}`).error(errorEvent, { status, statusText });

    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });
});
