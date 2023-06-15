import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 10;
  postsPerPage = 2;
  currenPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postSub: Subscription = new Subscription();
  private authStatusSub: Subscription = new Subscription();

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currenPage);
    this.isLoading = true;
    this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSub = this.authService
      .getAuthStatuslistener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currenPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currenPage);
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currenPage);
    });
  }
}
