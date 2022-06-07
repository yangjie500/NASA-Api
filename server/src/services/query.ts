// MongoDB will return all of the collection if 0 is passed
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query: { limit: string | undefined, page: string | undefined }) {
  const page = Math.abs(Number(query.page)) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(Number(query.limit)) || DEFAULT_PAGE_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit
  }
}

export {
  getPagination
}