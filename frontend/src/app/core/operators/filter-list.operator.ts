import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function filterList<T>(
  predicate: (value: T) => boolean,
): OperatorFunction<T[], T[]> {
  return (source: Observable<T[]>) =>
    source.pipe(map((list) => list.filter(predicate)));
}
