import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IPostCommentListItem } from './../../models/post.model';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent implements OnInit {
  @Input() item!: IPostCommentListItem;

  constructor() {}

  ngOnInit(): void {}
}
