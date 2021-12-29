import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PostDetailComponent } from 'src/app/posts/components/post-detail/post-detail.component';
import { PostItemComponent } from 'src/app/posts/components/post-item/post-item.component';
import { PostsService } from 'src/app/posts/posts.service';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { PostsComponent } from './posts.component';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: 'detail/:id', component: PostDetailComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [PostsComponent, SearchComponent, PostItemComponent, PostDetailComponent],
      providers: [PostsService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
