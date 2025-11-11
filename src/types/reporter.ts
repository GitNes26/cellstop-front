// types/reporter.ts (actualizado)
export type ChartType = "bar" | "line" | "pie" | "doughnut" | "scatter" | "area" | "radar" | "map";

export type FilterOperator =
   | "equals"
   | "not_equals"
   | "contains"
   | "not_contains"
   | "starts_with"
   | "ends_with"
   | "greater_than"
   | "greater_than_equal"
   | "less_than"
   | "less_than_equal"
   | "between"
   | "not_between"
   | "in"
   | "not_in"
   | "is_empty"
   | "is_not_empty"
   | "is_null"
   | "is_not_null";

export interface DataField {
   id: string;
   name: string;
   type: "string" | "number" | "date" | "boolean";
   displayName: string;
}

export interface FilterCondition {
   id: string;
   field: string;
   operator: FilterOperator;
   value: any;
   value2?: any;
}

export interface DateRange {
   startDate: string;
   endDate: string;
}

export interface ChartConfig {
   id: string;
   title: string;
   description: string;
   chartType: ChartType;
   xAxis: string;
   yAxis: string;
   filters: FilterCondition[];
   colorScheme: string;
   showLegend: boolean;
   showGrid: boolean;
   stacked?: boolean;
   dateRange?: DateRange;
}

export interface Report {
   id: string;
   name: string;
   description: string;
   chartConfig: ChartConfig;
   createdAt: Date;
   updatedAt: Date;
}
