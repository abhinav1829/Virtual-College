import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeedService } from 'src/app/services/feed.service';
import { Article } from 'src/app/models/article.model';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.css'],
})
export class UpdateFeedComponent implements OnInit {
  tabSelect = 0;
  feedForm: FormGroup;
  articles: Article[];

  constructor(private feedService: FeedService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.feedForm = new FormGroup({
      head: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      back: new FormControl(null, Validators.required),
      details: new FormControl(null, Validators.required),
      link: new FormControl(null, Validators.required),
    });
    this.articles = this.feedService.getFeed();
    this.feedService.feedChanged.subscribe((articles: Article[]) => {
      this.articles = articles;
    });
  }

  openDialog(i: number) {
    this.dialog.open(DialogComponent, { data: this.articles[i] });
  }

  onSubmit() {
    if (this.feedForm.valid) {
      this.feedService
        .addArticle(
          new Article(
            this.feedForm.value['head'],
            this.feedForm.value['body'],
            this.feedForm.value['back'],
            this.feedForm.value['details'].split('\n').filter((str: string) => {
              return str != '' && str != null && str != undefined;
            }),
            this.feedForm.value['link'].split(' ')
          )
        )
        .then(
          (res) => {
            this.feedForm.reset();
            console.log(res);
            this.tabSelect++;
          },
          (error) => {
            console.log(error);
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
        console.log(error);
      }
    );
  }
}
