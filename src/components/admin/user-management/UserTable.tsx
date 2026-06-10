import { ActionButtons } from "./ActionButtons";
import clsx from "clsx";

// Định nghĩa cấu trúc cột
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface UserTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isLoading?: boolean;
}

export const UserTable = <T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading = false,
}: UserTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        Loading data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        No records found.
      </div>
    );
  }

  return (
    // SỬA: Xóa dark:border-gray-800 dark:bg-gray-900 -> Luôn dùng nền trắng
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            {/* SỬA: Xóa dark:bg-white/5 dark:border-gray-700 */}
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                No.
              </th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={clsx(
                    "p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              <th className="p-4 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          {/* SỬA: Xóa dark:divide-gray-800 */}
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr
                key={item.id}
                // SỬA: Xóa dark:hover:bg-white/5 -> Chỉ hover màu xám nhạt
                className="group hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-sm font-medium text-gray-500">
                  {index + 1}.
                </td>
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    // SỬA: Xóa dark:text-gray-300 -> Luôn dùng chữ xám đậm
                    className="p-4 text-sm text-gray-700"
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                <td className="p-4 text-right">
                  <div className="flex justify-end">
                    <ActionButtons
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};