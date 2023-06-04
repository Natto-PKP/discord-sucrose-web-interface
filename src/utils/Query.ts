export type SizeType = 'mobile' | 'tablet' | 'desktop';

export default class Query {
  static sizes = [
    { key: 'mobile', query: '(max-width: 767px)' },
    { key: 'tablet', query: '(min-width: 768px) and (max-width: 1023px)' },
    { key: 'desktop', query: '(min-width: 1024px)' },
  ] as { key: SizeType; query: string }[];

  static getCurrentSize(): SizeType {
    const size = Query.sizes.find((s) => window.matchMedia(s.query).matches);
    return size?.key || 'mobile';
  }
}
