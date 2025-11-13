declare module "@lhncbc/ucum-lhc" {
  export type ConvertStatus = "succeeded" | "failed" | "error" | string;

  export interface ConvertUnitOptions {
    suggest?: boolean;
    molecularWeight?: number;
    charge?: number;
  }

  export interface ConvertUnitResult {
    status: ConvertStatus;
    toVal: number | null;
    msg: string[];
  }

  export class UcumLhcUtils {
    convertUnitTo(
      fromUnitCode: string,
      fromValue: number | string,
      toUnitCode: string,
      options?: ConvertUnitOptions,
    ): ConvertUnitResult;
  }
}
