import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Article } from '../models/article.model';
import { Circular } from '../models/circular.model';
import { Syllabus } from '../models/syllabus.model';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(
    private fireDatabase: AngularFireDatabase,
    private fireStorage: AngularFireStorage
  ) {}

  getArticles() {
    return new Promise((resolve, reject) => {
      let articles: Article[] = [];
      this.fireDatabase.database.ref('/articles').once(
        'value',
        (snapshot) => {
          snapshot.forEach((article) => {
            articles.push(
              new Article(
                article.child('head').val(),
                article.child('body').val(),
                article.child('details').val(),
                article.child('links').val(),
                article.key,
                article.child('cover').val()
              )
            );
          });
          resolve(articles);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }

  getCirculars() {
    return new Promise((resolve, reject) => {
      let circulars: Circular[] = [];
      this.fireDatabase.database.ref('/circulars').once(
        'value',
        (snapshot) => {
          snapshot.forEach((circular) => {
            circulars.push(
              new Circular(
                circular.child('subject').val(),
                circular.child('author').val(),
                circular.key,
                circular.child('downloadUrl').val()
              )
            );
          });
          resolve(circulars);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }

  addArticleStorage(date: string, file: File) {
    return this.fireStorage.storage.ref('/articles/' + date).put(file);
  }

  addArticleDatabase(article: Article) {
    return this.fireDatabase.database.ref('/articles/' + article.date).set({
      head: article.head,
      body: article.body,
      cover: article.cover,
      details: article.details,
      links: article.links,
    });
  }

  addCircularStorage(date: string, file: File) {
    return this.fireStorage.storage.ref('/circulars/' + date).put(file);
  }

  addCircularDatabase(circular: Circular) {
    return this.fireDatabase.database.ref('/circulars/' + circular.date).set({
      subject: circular.subject,
      author: circular.author,
      downloadUrl: circular.downloadUrl,
    });
  }

  deleteArticle(date: string) {
    return Promise.all([
      this.fireDatabase.database.ref('/articles/' + date).remove(),
      this.fireStorage.storage.ref('/articles/' + date).delete(),
    ]);
  }

  deleteCircular(date: string) {
    return Promise.all([
      this.fireDatabase.database.ref('/circulars/' + date).remove(),
      this.fireStorage.storage.ref('/circulars/' + date).delete(),
    ]);
  }
}
