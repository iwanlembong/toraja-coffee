type Props = {
  page: number;

  totalPages: number;

  setPage: (
    page: number
  ) => void;
};

export default function Pagination({
  page,
  totalPages,
  setPage,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        disabled={page === 1}
        onClick={() =>
          setPage(page - 1)
        }
        className="border px-4 py-2 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <p className="font-medium">
        Page {page} of{" "}
        {totalPages}
      </p>

      <button
        disabled={
          page === totalPages
        }
        onClick={() =>
          setPage(page + 1)
        }
        className="border px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}