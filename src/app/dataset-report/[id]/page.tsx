import { DatasetReportDetail } from "@/infrastructure/modules/dataset-report"

interface DatasetReportDetailPageProps {
  params: Promise<{ id: string }>
}

const DatasetReportDetailPage = async ({ params }: DatasetReportDetailPageProps) => {
  const { id } = await params
  return <DatasetReportDetail datasetId={id} />
}

export default DatasetReportDetailPage
