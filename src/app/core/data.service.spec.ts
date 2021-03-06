import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { DataService } from './data.service';
import { Book } from '../models/book';
import { BookTrackerError } from '../models/bookTrackerError';

describe('DataService Tests', () => {
  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  const testBooks: Book[] = [
    { bookID: 1, title: 'Goodnight Moon', author: 'Margaret Wise Brown', publicationYear: 1945 },
    { bookID: 2, title: 'Winnie-the-Pooh', author: 'A. A. Milne', publicationYear: 1926 },
    { bookID: 3, title: 'The Hobbit', author: 'J. R. R. Tolkien', publicationYear: 1937 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    dataService = TestBed.get(DataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should GET all books', () => {
    dataService.getAllBooks().subscribe((data: Book[]) => {
      expect(data.length).toEqual(testBooks.length);
    });

    const booksRequest: TestRequest = httpTestingController.expectOne('/api/books');
    expect(booksRequest.request.method).toEqual('GET');

    booksRequest.flush(testBooks);
  });

  it('should return a BookTrackerError', () => {
    dataService.getAllBooks().subscribe(
      () => fail('this should have been an error'),
      (error: BookTrackerError) => {
        expect(error.errorNumber).toEqual(100);
        expect(error.friendlyMessage).toEqual('An error occurred retrieving data.');
      }
    );

    const booksRequest: TestRequest = httpTestingController.expectOne('/api/books');

    booksRequest.flush('error', {
      status: 500,
      statusText: 'Server Error'
    });
  });
});
