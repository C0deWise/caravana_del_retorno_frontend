
const reporTypes = ["general", "colony"] as const;
export type ReportType = typeof reporTypes[number];

export interface GeneralReportParams {
    type: "general";
    returnId: number;
}

export interface ColonyReportParams {
    type:"colony";
    returnId: number;
    colonyId: number;
}

export type ReportParams = GeneralReportParams | ColonyReportParams;