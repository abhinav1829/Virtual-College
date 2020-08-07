import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-teacher-feed',
  templateUrl: './teacher-feed.component.html',
  styleUrls: ['./teacher-feed.component.css'],
})
export class TeacherFeedComponent implements OnInit {
  articles: Article[];

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.articles = this.feedService.getFeed();
  }
}
