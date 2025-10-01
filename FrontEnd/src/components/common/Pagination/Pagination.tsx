import ReactPaginate from "react-paginate";
import "./Pagination.css";
import type { PaginationProps } from "../../../types/index.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Pagination({
  pageCount,
  onPageChange,
  currentPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      // === Core Props ===
      pageCount={pageCount}
      initialPage={currentPage - 1}
      onPageChange={onPageChange}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      // === Labels ===
      previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
      nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
      breakLabel="..."
      // === Container ===
      containerClassName="containerClassName"
      // === Page Items ===
      pageClassName="pageClassName"
      pageLinkClassName="pageLinkClassName"
      activeClassName="activeClassName"
      activeLinkClassName="activeLinkClassName"
      // === Previous Button ===
      previousClassName="flex items-center"
      previousLinkClassName="py-1 px-2 btn-outline-primary"
      // === Next Button ===
      nextClassName="flex items-center"
      nextLinkClassName="py-1 px-2 mb-0 btn-outline-primary"
      // === Break (...) ===
      breakClassName="px-2"
      breakLinkClassName="text-gray-500"
      // === Disabled State ===
      disabledClassName="opacity-50 cursor-not-allowed"
      disabledLinkClassName="pointer-events-none"
    />
  );
}
