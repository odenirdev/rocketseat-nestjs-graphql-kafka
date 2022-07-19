export class PaginateService {
  create(page?: number) {
    if (!page) return;

    return {
      take: 10,
      skip: 10 * (page - 1),
    };
  }
}
