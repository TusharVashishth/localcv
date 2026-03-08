
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { Observability, DefaultExporter, CloudExporter, SensitiveDataFilter } from '@mastra/observability';
import { weatherWorkflow } from './workflows/weather-workflow';
import {
  experienceRefineAgent,
  profileSummaryAgent,
  projectRefineAgent,
} from "./agents/resume-agent";


export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { profileSummaryAgent, experienceRefineAgent, projectRefineAgent },
  // storage: new LibSQLStore({
  //   id: "mastra-storage",
  //   // stores observability, scores, ... into persistent file storage
  //   url: "file:./mastra.db",
  // }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
          new CloudExporter(), // Sends traces to Mastra Cloud (if MASTRA_CLOUD_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
