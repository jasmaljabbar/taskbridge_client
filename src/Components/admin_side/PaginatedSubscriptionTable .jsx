import React from 'react';

export const PaginatedTable = ({ data, headers, dataFields, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage }) => {
  // Check if data is an array and has items
  const isValidData = Array.isArray(data) && data.length > 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = isValidData ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!isValidData) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="py-2 px-4 border-b">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="even:bg-gray-100">
                {dataFields.map((field, i) => (
                  <td key={i} className="py-2 px-4 border-b pl-32 bg-slate-500">
                    {field.split('.').reduce((o, k) => (o || {})[k], item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
        <select
          className="border rounded p-2 mb-2 md:mb-0"
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          value={itemsPerPage}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
        <div className="flex flex-wrap">
          {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};