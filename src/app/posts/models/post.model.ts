import { IUserListItem } from 'src/app/posts/models/user.model';

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
  comments: IPostCommentListItem[];
  user: IUserListItem | undefined;
}

export interface IPostListItem {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IPostCommentListItem {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
