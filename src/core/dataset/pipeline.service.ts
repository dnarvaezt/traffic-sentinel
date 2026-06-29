// ─── Pipeline service: run ImportEngine + persist results ────────────────────

import { importEngine } from "@/core/data-import/application/import-engine"
import type { SchemaDefinition } from "@/core/data-import/domain/models/schema"
import {
  buildPipelineKey,
  deletePipelineResult,
  loadPipelineResult,
  type StoredPipelineResult,
  savePipelineResult,
} from "./pipeline.repository"

export interface PipelineRunOptions {
  file: File
  schema: SchemaDefinition
  runtimeFilters?: Record<string, any>
}

export async function runPipeline(
  projectId: string,
  databaseId: string,
  options: PipelineRunOptions,
): Promise<StoredPipelineResult> {
  const result = await importEngine.run(options.file, options.schema, options.runtimeFilters)

  const stored: StoredPipelineResult = {
    id: buildPipelineKey(projectId, databaseId),
    projectId,
    databaseId,
    rawData: result.rawData,
    transformedData: result.transformedData,
    calculatedData: result.calculatedData,
    errors: result.errors,
  }

  await savePipelineResult(stored)
  return stored
}

export async function loadPipeline(
  projectId: string,
  databaseId: string,
): Promise<StoredPipelineResult | undefined> {
  return loadPipelineResult(projectId, databaseId)
}

export async function deletePipeline(projectId: string, databaseId: string): Promise<void> {
  await deletePipelineResult(projectId, databaseId)
}

export type { StoredPipelineResult }
