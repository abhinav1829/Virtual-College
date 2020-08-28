import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { FeedService } from 'src/app/services/feed.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-feed',
  templateUrl: './teacher-feed.component.html',
  styleUrls: ['./teacher-feed.component.css'],
})
export class TeacherFeedComponent implements OnInit {
  articles: Article[];

  constructor(
    private feedService: FeedService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.feedService.getFeed().then((articles: Article[]) => {
      this.articles = articles;
    });
    this.feedService.feedChanged.subscribe((articles: Article[]) => {
      this.articles = articles;
    });
  }

  openDialog(i: number) {
    this.dialog.open(DialogComponent, { data: this.articles[i] });
  }

  generateJSON(i: number) {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(this.articles[i], (key, value) => {
            if (key !== 'back') {
              return value;
            }
          })
        )
    );
  }
}
