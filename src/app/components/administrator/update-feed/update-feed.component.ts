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

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.css'],
})
export class UpdateFeedComponent implements OnInit {
  tabSelect = 0;

  articleForm: FormGroup;
  articles: Article[];

  circularForm: FormGroup;
  selectedFile: File;
  progress: number;

  @ViewChild(FormGroupDirective, { static: true }) formRef: FormGroupDirective;

  constructor(private feedService: FeedService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.progress = 0;
    this.articleForm = new FormGroup({
      head: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      back: new FormControl(null, Validators.required),
      details: new FormControl(null, Validators.required),
      link: new FormControl(null, Validators.required),
    });
    this.circularForm = new FormGroup({
      subject: new FormControl(null, Validators.required),
    });
    this.feedService.getFeed().then(
      (articles: Article[]) => {
        this.articles = articles;
      },
      (error) => {
        alert(error);
      }
    );
    this.feedService.feedChanged.subscribe((articles: Article[]) => {
      this.articles = articles;
    });
  }

  openDialog(i: number) {
    this.dialog.open(DialogComponent, { data: this.articles[i] });
  }

  onArticleSubmit() {
    if (this.articleForm.valid) {
      this.feedService
        .addArticle(
          new Article(
            this.articleForm.value['head'],
            this.articleForm.value['body'],
            this.articleForm.value['back'],
            this.articleForm.value['details']
              .split('\n')
              .filter((str: string) => {
                return str != '' && str != null && str != undefined;
              }),
            this.articleForm.value['link'].split(' ')
          )
        )
        .then(
          (res) => {
            console.log(res);
            this.formRef.resetForm();
            this.tabSelect--;
          },
          (error) => {
            alert(error);
          }
        );
    } else {
      alert('Invalid form!');
    }
  }

  onDeleteArticle(i: number) {
    this.feedService.deleteArticle(i).then(
      (res) => {
        console.log(res);
      },
      (error) => {
        alert(error);
      }
    );
  }

  detectFile(event: { target: { files: { item: (arg0: number) => File } } }) {
    this.selectedFile = event.target.files.item(0);
  }

  onCircularSubmit() {
    this.feedService
      .addCircular(
        new Circular(this.circularForm.get('subject').value, this.selectedFile)
      )
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          alert(error.message);
        },
        () => {
          console.log('Circular added');
          this.progress = 0;
        }
      );
  }

  onDeleteCircular() {
    this.feedService.deleteCircular('1').then(
      (res) => {
        alert(res);
      },
      (error) => {
        alert(error);
      }
    );
  }
}
