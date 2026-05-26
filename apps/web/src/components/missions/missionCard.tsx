import { Card } from "@/components/ui/card"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"

export default function MissionCard({
  mission,
}: {
  mission: FindMissionsByUserIdType[number]
}) {
  return <Card></Card>
}
