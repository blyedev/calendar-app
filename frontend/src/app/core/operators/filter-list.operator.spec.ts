import { of } from 'rxjs';
import { filterList } from './filter-list.operator';

describe('filterList', () => {
  it('should filter an array based on the predicate provided', (done) => {
    const source$ = of([1, 2, 3, 4, 5, 6]);

    const result$ = source$.pipe(filterList((value) => value > 3));

    result$.subscribe((result) => {
      expect(result).toEqual([4, 5, 6]);
      done();
    });
  });

  it('should return an empty array if no elements match the predicate', (done) => {
    const source$ = of([1, 2, 3]);

    const result$ = source$.pipe(filterList((value) => value > 10));

    result$.subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('should return the same array if all elements match the predicate', (done) => {
    const source$ = of([1, 2, 3]);

    const result$ = source$.pipe(filterList((value) => value > 0));

    result$.subscribe((result) => {
      expect(result).toEqual([1, 2, 3]);
      done();
    });
  });

  it('should work with an empty array', (done) => {
    const source$ = of([]);

    const result$ = source$.pipe(filterList(() => true));

    result$.subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });
});
