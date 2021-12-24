import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';

@NgModule({
  declarations: [PostsComponent, PostItemComponent, PostDetailComponent],
  imports: [PostsRoutingModule, SharedModule],
})
export class PostsModule {}
