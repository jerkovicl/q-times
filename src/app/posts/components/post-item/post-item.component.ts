import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPost } from './../../models/post.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent implements OnInit {
  @Input()
  post!: IPost;
  @Output() deleted = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    //  console.log('post', this.post);
  }

  delete(id: string): void {
    this.deleted.emit(id);
  }
}
