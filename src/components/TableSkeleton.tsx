import React from "react";

interface TableSkeletonProps {
   rows?: number;
   columns?: number;
   hasHeader?: boolean;
   hasSearch?: boolean;
   hasPagination?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 6, hasHeader = true, hasSearch = true, hasPagination = true }) => {
   return (
      <div className="w-full space-y-4 animate-pulse">
         {hasSearch && (
            <div className="flex items-center justify-between">
               <div className="h-10 bg-gray-200 rounded w-64"></div>
               <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
         )}

         <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            {hasHeader && (
               <div className="bg-gray-100 border-b border-gray-200">
                  <div className="flex px-4 py-3">
                     {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="flex-1 mx-1">
                           <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="bg-white divide-y divide-gray-100">
               {Array.from({ length: rows }).map((_, rowIdx) => (
                  <div key={rowIdx} className="flex px-4 py-3">
                     {Array.from({ length: columns }).map((_, colIdx) => (
                        <div key={colIdx} className="flex-1 mx-1">
                           <div
                              className="h-4 bg-gray-200 rounded"
                              style={{
                                 width: colIdx === 0 ? "70%" : `${Math.floor(Math.random() * 40 + 30)}%`
                              }}
                           ></div>
                        </div>
                     ))}
                  </div>
               ))}
            </div>

            {hasPagination && (
               <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="flex space-x-2">
                     <div className="h-8 bg-gray-200 rounded w-8"></div>
                     <div className="h-8 bg-gray-200 rounded w-8"></div>
                     <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default TableSkeleton;
