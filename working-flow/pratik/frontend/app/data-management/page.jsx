import { DataTable } from '../../components/data-table'

export default function DataManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Management</h2>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Search and Filter</h3>
        <p className="text-sm text-gray-500">Use the search bar to find specific content or filter by resource type.</p>
      </div>
      <DataTable />
    </div>
  )
}

