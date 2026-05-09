export function buildListQuery(query, allowedSortFields = []) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || "";

    const sortBy = allowedSortFields.includes(query.sortBy)
        ? query.sortBy
        : "createdAt";

    const sortOrder =
        query.sortOrder === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        search,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: search
            ? {
                  OR: [], // nanti diisi per module
              }
            : {},
    };
}