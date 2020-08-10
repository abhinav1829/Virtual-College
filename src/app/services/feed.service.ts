import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private articles: Article[];
  feedChanged = new EventEmitter<Article[]>();

  constructor(private fireDatabase: AngularFireDatabase) {
    this.syncFeed();
  }

  syncFeed() {
    this.articles = [];
    this.fireDatabase.database.ref('/articles').once(
      'value',
      (snapshot) => {
        snapshot.forEach((article) => {
          this.articles.push({
            head: article.child('head').val(),
            body: article.child('body').val(),
            back: article.child('back').val(),
            details: article.child('details').val(),
            link: article.child('link').val(),
            date: article.key,
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getFeed() {
    return this.articles;
  }

  async addArticle(article: Article) {
    return new Promise((resolve, reject) => {
      this.fireDatabase.database
        .ref('/articles/' + article.date)
        .set({
          head: article.head,
          body: article.body,
          back: article.back,
          details: article.details,
          link: article.link,
        })
        .then(
          () => {
            this.syncFeed();
            this.feedChanged.emit(this.articles);
            resolve('Article added.');
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async deleteArticle(i: number) {
    return new Promise((resolve, reject) => {
      this.fireDatabase.database
        .ref('/articles/' + this.articles[i].date)
        .remove()
        .then(
          () => {
            this.syncFeed();
            this.feedChanged.emit(this.articles);
            resolve('Article deleted.');
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}
