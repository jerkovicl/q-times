import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { forkJoin, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { IPost, IPostListItem } from 'src/app/posts/models/post.model';
import { IUserListItem } from 'src/app/posts/models/user.model';
import { PostsService } from 'src/app/posts/posts.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public searchControl = new FormControl();
  public items: IPost[] | null = [];
  public searchTerm: string = '';
  public posts: IPost[] | null = [];
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @Output() searched = new EventEmitter<string>();
  @Output() selected = new EventEmitter<number>();
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    // from event
    //fromEvent(this.searchInput.nativeElement, 'input').pipe();
  }

  public onChange(event: any) {
    const input = event.target;
    const lst = input.getAttribute('list');
    const options = document.querySelectorAll(`#${lst} option`);
    const hiddenInput = <HTMLInputElement>document.getElementById(`${input.id}-hidden`);
    const inputValue = input.value;

    hiddenInput.value = inputValue;

    for (let i = 0; i < options.length; i++) {
      const option = options[i] as HTMLElement;
      if (option.innerText.includes(inputValue)) {
        if (hiddenInput) {
          hiddenInput.value = option.getAttribute('data-val') ?? '';
          break;
        }
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  public onSearch(event: any, term: string) {
    //user has pressed enter or selected item from autocomplete
    this.search(term);
    if (event.keyCode === 13) {
      console.log(this.items);
      this.searched.emit(<any>this.posts);

      console.log(event);
      this.searchInput.nativeElement.blur();
      //  this.searchTerm = '';
    } else if (event.keyCode === undefined) {
      const hiddenInput = <HTMLInputElement>document.getElementById('search-hidden');
      if (hiddenInput.value) {
        this.selected.emit(hiddenInput.value as any);
      }
    }
  }

  public search(term: string) {
    if (term && term.trim() != '') {
      of(term)
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => {
            this.items = [];
            console.log('search term', term);
            /* this.errorMsg = '';
                this.isLoading = true; */
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
            //  this.errorMsg = 'no data';
            this.items = [];
          } else {
            //  this.errorMsg = '';
            this.items = data as IPost[];
            this.posts = data as IPost[];
          }
          console.log('search data', data);
        });
    }
  }
}
