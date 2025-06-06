"use client"

import * as React from "react"
import { CampaignTable } from "@/components/campaign-table"
import campaignService from "@/services/campaign"

interface Campaign {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  banner: string
}

export default function CampaignList() {
  const [data, setData] = React.useState<Campaign[]>([])

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignService.getCampaigns()
        setData(response)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      }
    }
    fetchCampaigns()
  }, [])

  return (
    <div className="p-6">
      <CampaignTable data={data} />
    </div>
  )
}