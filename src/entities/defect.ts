export interface Defect {
  id: number;
  checkDate: string;
  checkTime: string;
  objectName: string;
  operatorSignature: string;
  operatorName: string;
  defectDescription: string;
  reportedTo: string;
  reportedDateTime: string;
  resolution: string;
  resolutionSignature: string;
  resolutionName: string;
  resolvedMark: string;
  resolvedSignature: string;
  resolvedName: string;
  comment: string;
  domain: string;
}
