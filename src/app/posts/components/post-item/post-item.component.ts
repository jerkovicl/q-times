import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit(): void {
    //  console.log('post', this.post);
  }
}
