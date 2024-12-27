import { Connection, Edge, Pagination } from '@/modules/common/types/query.type';

export class PaginationFactory {
  static createCursorBasedPage<Schema>(
    items: Schema[],
    totalCount: number,
    pageSize: number,
    cursorExtractor: (item: Schema) => string,
  ): Connection<Schema> {
    const edges: Edge<Schema>[] = items.map((item) => ({
      node: item,
      cursor: cursorExtractor(item),
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      totalCount,
      pageInfo: {
        hasNextPage: items.length >= pageSize,
        endCursor,
      },
      edges,
    };
  }

  static createOffsetBasedPage<Schema>(
    items: Schema[],
    totalCount: number,
    page: number,
    limit: number,
    offset: number,
  ): Pagination<Schema> {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      page,
      limit,
      items,
      totalCount,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
    };
  }

  static getOffset(page: number = 1, limit: number): number {
    return (page - 1) * limit;
  }
}
