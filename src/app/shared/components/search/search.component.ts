import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IPost } from 'src/app/posts/models/post.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @Input() items: IPost[] | null = [];
  @Output() searched = new EventEmitter<string>();
  @Output() selected = new EventEmitter<number | string>();
  @Output() filtered = new EventEmitter<IPost[]>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  public searchTerm = '';
  constructor() {}

  ngOnInit(): void {}

  public onChange(event: any) {
    const input = event.target;
    const list = input.getAttribute('list');
    const options = document.querySelectorAll(`#${list} option`);
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
    this.searched.emit(term);
    if (event.keyCode === 13) {
      console.log('filtered items', this.items);
      this.filtered.emit(this.items as IPost[]);
      this.searchInput.nativeElement.blur();
      //  this.searchTerm = '';
    } else if (event.keyCode === undefined) {
      const hiddenInput = <HTMLInputElement>document.getElementById('search-hidden');
      if (hiddenInput.value) {
        this.selected.emit(hiddenInput.value);
      }
    }
  }
}
