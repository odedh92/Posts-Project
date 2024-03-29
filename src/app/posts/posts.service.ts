import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { response } from 'express';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount:number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number , currengPage:number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currengPage}`
    this.http
      .get<{ message: string; posts: any,maxPosts:number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          const transformedPosts = postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          });
          return { posts: transformedPosts, maxPosts: postData.maxPosts };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next(
          {posts: [...this.posts],
          postCount: transformedPostsData.maxPosts});
      });
  }
  getPost(id: string) {
    return this.http.get<{
      creator: string;
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: '',
      creator:  ''
    };
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image as string,
        creator: ''
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
   return this.http
      .delete('http://localhost:3000/api/posts/' + postId)
  }
}
