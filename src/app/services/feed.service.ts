import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Article } from '../models/article.model';
import { Circular } from '../models/circular.model';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private articles: Article[];
  feedChanged = new EventEmitter<Article[]>();

  constructor(
    private fireDatabase: AngularFireDatabase,
    private fireStorage: AngularFireStorage
  ) {}

  getFeed() {
    return new Promise((resolve, reject) => {
      this.syncFeed().then(
        (articles: Article[]) => {
          resolve(articles);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  syncFeed() {
    return new Promise((resolve, reject) => {
      let articles = [];
      this.fireDatabase.database.ref('/articles').once(
        'value',
        (snapshot) => {
          snapshot.forEach((article) => {
            articles.push({
              head: article.child('head').val(),
              body: article.child('body').val(),
              back: article.child('back').val(),
              details: article.child('details').val(),
              link: article.child('link').val(),
              date: article.key,
            });
          });
          this.feedChanged.emit(articles);
          resolve(articles);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }

  addArticle(article: Article) {
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
            this.syncFeed().then(
              (articles: Article[]) => {
                this.articles = articles;
                resolve('Article added.');
              },
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteArticle(i: number) {
    return new Promise((resolve, reject) => {
      this.fireDatabase.database
        .ref('/articles/' + this.articles[i].date)
        .remove()
        .then(
          () => {
            this.syncFeed().then(
              (articles: Article[]) => {
                this.articles = articles;
                resolve('Article deleted.');
              },
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  addCircular(circular: Circular) {
    return this.fireStorage.storage
      .ref('/circulars/' + circular.name)
      .put(circular.file, {
        customMetadata: {
          head: circular.head,
          date: circular.date.toISOString(),
        },
      });
  }

  deleteCircular(name: string) {
    return this.fireStorage.storage.ref('/circulars/' + name).delete();
  }
}
