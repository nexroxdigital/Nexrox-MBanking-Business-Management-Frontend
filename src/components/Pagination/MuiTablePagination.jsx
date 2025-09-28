import TablePagination from "@mui/material/TablePagination";

const MuiTablePagination = ({ table }) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const rowCount = table.getFilteredRowModel().rows.length; // or server total

  return (
    <TablePagination
      component="div"
      count={rowCount}
      page={pageIndex}
      onPageChange={(e, newPage) => table.setPageIndex(newPage)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      rowsPerPageOptions={[5, 10, 20]}
      labelRowsPerPage="প্রতি পৃষ্ঠা"
      labelDisplayedRows={({ from, to, count }) => {
        const totalPages = Math.ceil(count / pageSize);
        const current = pageIndex + 1;

        let pages = [];
        if (totalPages <= 7) {
          pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
          if (current <= 4) {
            pages = [1, 2, 3, 4, 5, "...", totalPages];
          } else if (current >= totalPages - 3) {
            pages = [
              1,
              "...",
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ];
          } else {
            pages = [
              1,
              "...",
              current - 1,
              current,
              current + 1,
              "...",
              totalPages,
            ];
          }
        }

        return `পৃষ্ঠা: ${pages.join(" ")}`;
      }}
    />
  );
};

export default MuiTablePagination;
