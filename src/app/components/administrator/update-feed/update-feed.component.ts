import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeedService } from 'src/app/services/feed.service';
import { Article } from 'src/app/models/article.model';

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.css'],
})
export class UpdateFeedComponent implements OnInit {
  feedForm: FormGroup;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.feedForm = new FormGroup({
      head: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      back: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.feedService.addArticle(
      new Article(
        this.feedForm.value['head'],
        this.feedForm.value['body'],
        this.feedForm.value['back']
      )
    );
  }
}
