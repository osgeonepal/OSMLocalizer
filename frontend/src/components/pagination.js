import ReactPaginate from "react-paginate";

export const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  return (
    <div className="row">
      <div className="col-12 mt-4">
        <ReactPaginate
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          pageCount={pageCount}
          pageRangeDisplayed={2}
          marginPagesDisplayed={3}
          onPageChange={(event) => onPageChange(event.selected)}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="d-none"
          nextClassName="d-none"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default Pagination;
