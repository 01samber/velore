export default function CRMDataTable({ columns, rows, rowKey }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((c) => (
              <th key={c.key} className="text-left font-semibold text-slate-700 py-3 pr-4 whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={rowKey(r)} className="hover:bg-slate-50/60">
              {columns.map((c) => (
                <td key={c.key} className="py-3 pr-4 align-top">
                  {typeof c.cell === 'function' ? c.cell(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

