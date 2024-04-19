import {Pagination, PaginationItem, PaginationCursor} from "@nextui-org/pagination";


export default function Footer() {
  return (
    <div className="flex items-center justify-center w-full py-3">
        <Pagination total={10} initialPage={1} />
    </div>
  );
}
