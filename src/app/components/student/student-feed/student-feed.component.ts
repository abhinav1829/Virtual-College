import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { FeedService } from 'src/app/services/feed.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-student-feed',
  templateUrl: './student-feed.component.html',
  styleUrls: ['./student-feed.component.css'],
})
export class StudentFeedComponent implements OnInit {
  isLoading: boolean;
  tabs: number[];
  tabSelect: number;
  private articles: Article[];

  constructor(
    private feedService: FeedService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.isLoading = false;
    this.tabs = [];
    this.tabSelect = 0;
    this.articles = [];
  }

  ngOnInit() {
    this.isLoading = true;
    this.feedService
      .getFeed()
      .then(
        (articles: Article[]) => {
          this.articles = articles;
          this.tabs = [];
          for (let i = 0; i < (articles.length + 2) / 3; i++) {
            this.tabs.push(i);
          }
          setInterval(() => {
            this.tabSelect++;
            if (this.tabSelect >= this.tabs.length) {
              this.tabSelect = 0;
            }
          }, 3000);
        },
        (error) => {
          alert(error);
        }
      )
      .finally(() => {
        this.isLoading = false;
      });
    this.feedService.feedChanged.subscribe((articles: Article[]) => {
      this.articles = articles;
      this.tabs = [];
      for (let i = 0; i < (articles.length + 2) / 3; i++) {
        this.tabs.push(i);
      }
    });
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

  generateJSON(tab: number, i: number) {
    return this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(this.articles[3 * tab + i], (key, value) => {
            if (key !== 'back') {
              return value;
            }
          })
        )
    );
  }
}
