import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private articles: Article[];

  constructor(private fireDatabase: AngularFireDatabase) {
    this.articles = [];
    this.fireDatabase.database.ref('/articles').once(
      'value',
      (snapshot) => {
        snapshot.forEach((article) => {
          this.articles.push({
            head: article.child('head').val(),
            body: article.child('body').val(),
            back: article.child('back').val(),
            date: article.key,
          });
        });
      },
      (error) => {
        console.log('Error occurred: ' + error.message);
      }
    );
  }

  getFeed() {
    return this.articles;
  }

  addArticle(article: Article) {
    this.fireDatabase.database
      .ref('/articles/' + article.date)
      .set({ head: article.head, body: article.body, back: article.back })
      .catch((error) => {
        console.log(error);
      });
  }
}
