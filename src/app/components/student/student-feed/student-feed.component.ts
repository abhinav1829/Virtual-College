import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { FeedService } from 'src/app/services/feed.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Circular } from 'src/app/models/circular.model';

@Component({
  selector: 'app-student-feed',
  templateUrl: './student-feed.component.html',
  styleUrls: ['./student-feed.component.css'],
})
export class StudentFeedComponent implements OnInit {
  isLoading: boolean;
  circularPanelState: boolean;
  tabs: number[];
  tabSelect: number;
  articles: Article[];
  circulars: Circular[];

  constructor(
    private feedService: FeedService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.isLoading = false;
    this.circularPanelState = false;
    this.tabs = [];
    this.tabSelect = 0;
    this.articles = [];
    this.circulars = [];
  }

  ngOnInit() {
    this.isLoading = true;
    this.syncFeed();
  }

  syncFeed() {
    Promise.all([
      this.feedService.getArticles(),
      this.feedService.getCirculars(),
    ])
      .then(
        (feed: [Article[], Circular[]]) => {
          this.articles = feed[0];
          this.circulars = feed[1];
          this.tabs = this.getTabs();
          setInterval(() => {
            if (this.tabSelect >= this.tabs.length - 1) this.tabSelect = 0;
            else this.tabSelect++;
          }, 3000);
        },
        (error) => {
          alert(error);
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  getTabs() {
    let tabs = [];
    for (let i = 0; i < Math.floor((this.articles.length + 2) / 3); i++) {
      tabs.push(i);
    }
    return tabs;
  }

  getArticles(tab: number) {
    let articles: Article[] = [];
    if (typeof this.articles[3 * tab] !== 'undefined') {
      articles.push(this.articles[3 * tab]);
    }
    if (typeof this.articles[3 * tab + 1] !== 'undefined') {
      articles.push(this.articles[3 * tab + 1]);
    }
    if (typeof this.articles[3 * tab + 2] !== 'undefined') {
      articles.push(this.articles[3 * tab + 2]);
    }
    return articles;
  }

  generateJSON(tab: number, i: number) {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(this.articles[3 * tab + i], (key, value) => {
            if (key !== 'cover') {
              return value;
            }
          })
        )
    );
  }

  onPrev() {
    if (this.tabSelect <= 0) this.tabSelect = this.tabs.length - 1;
    else this.tabSelect--;
  }

  onNext() {
    if (this.tabSelect >= this.tabs.length - 1) this.tabSelect = 0;
    else this.tabSelect++;
  }

  openDialog(tab: number, i: number) {
    this.dialog.open(DialogComponent, { data: this.articles[3 * tab + i] });
  }
}
