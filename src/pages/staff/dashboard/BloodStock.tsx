import { BloodUnitTable } from "@/components/dashboard/data-table"

import data from "./data.json"

export default function BloodStock() {
  return (
    <div className="p-6">
      <BloodUnitTable data={data} />
    </div>
  )
}