import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase/app';

import { FeedService } from 'src/app/services/feed.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Article } from 'src/app/models/article.model';
import { Circular } from 'src/app/models/circular.model';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.css'],
})
export class UpdateFeedComponent implements OnInit {
  isLoading: boolean;
  circularPanelState: boolean;
  tabs: number[];
  mainTabSelect: number;
  tabSelect: number;

  articleForm: FormGroup;
  selectedImage: File;
  progressArticle: number;
  articles: Article[];

  circularForm: FormGroup;
  selectedFile: File;
  progressCircular: number;
  circulars: Circular[];

  @ViewChild(FormGroupDirective, { static: true }) formRef: FormGroupDirective;

  constructor(
    private feedService: FeedService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.isLoading = false;
    this.circularPanelState = false;
    this.tabs = [];
    this.mainTabSelect = 0;
    this.tabSelect = 0;
    this.articles = [];
    this.progressCircular = 0;
    this.progressArticle = 0;
    this.circulars = [];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.progressCircular = 0;
    this.progressArticle = 0;

    this.articleForm = new FormGroup({
      head: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      details: new FormControl(null, Validators.required),
      links: new FormControl(null, Validators.required),
    });

    this.circularForm = new FormGroup({
      subject: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
    });

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

  onArticleSubmit() {
    if (this.articleForm.valid) {
      let date = formatDate(new Date(), 'yyyyMMddHHmmss', 'en-IN');
      let uploadTaskEvent = this.feedService.addArticleStorage(
        date,
        this.selectedImage
      );
      uploadTaskEvent.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          this.progressArticle =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          alert(error.message);
        },
        () => {
          uploadTaskEvent.snapshot.ref
            .getDownloadURL()
            .then(
              (url: string) => {
                let article = new Article(
                  this.articleForm.value['head'],
                  this.articleForm.value['body'],
                  this.articleForm.value['details']
                    .split('\n')
                    .filter((str: string) => {
                      return str != '' && str != null && str != undefined;
                    }),
                  this.articleForm.value['links'].split(' '),
                  date,
                  url
                );
                this.feedService.addArticleDatabase(article);
                this.articles.push(article);
                this.tabs = this.getTabs();
                this.formRef.resetForm();
                this.mainTabSelect--;
              },
              (error) => {
                alert(error);
              }
            )
            .finally(() => {
              this.progressArticle = 0;
            });
        }
      );
    } else {
      alert('Invalid form!');
    }
  }

  onDeleteArticle(date: string, tab: number, i: number) {
    this.feedService.deleteArticle(date).then(
      () => {
        this.articles.splice(3 * tab + i, 1);
        this.tabs = this.getTabs();
      },
      (error) => {
        alert(error);
      }
    );
  }

  detectImage(event: { target: { files: { item: (arg0: number) => File } } }) {
    this.selectedImage = event.target.files.item(0);
  }

  detectFile(event: { target: { files: { item: (arg0: number) => File } } }) {
    this.selectedFile = event.target.files.item(0);
  }

  onCircularSubmit() {
    if (this.circularForm.valid) {
      let date = formatDate(new Date(), 'yyyyMMddHHmmss', 'en-IN');
      let uploadTaskEvent = this.feedService.addCircularStorage(
        date,
        this.selectedFile
      );
      uploadTaskEvent.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          this.progressCircular =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          alert(error.message);
        },
        () => {
          uploadTaskEvent.snapshot.ref
            .getDownloadURL()
            .then(
              (url: string) => {
                let circular = new Circular(
                  this.circularForm.value['subject'],
                  this.circularForm.value['author'],
                  date,
                  url
                );
                this.feedService.addCircularDatabase(circular);
                this.circulars.push(circular);
              },
              (error) => {
                alert(error);
              }
            )
            .finally(() => {
              this.progressCircular = 0;
            });
        }
      );
    } else {
      alert('Invalid form!');
    }
  }

  onDeleteCircular(name: string, i: number) {
    this.feedService.deleteCircular(name).then(
      () => {
        this.circulars.splice(i, 1);
      },
      (error) => {
        alert(error);
      }
    );
  }
}
