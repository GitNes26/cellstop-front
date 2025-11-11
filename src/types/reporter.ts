// types/reporter.ts
export type ChartType = "bar" | "line" | "pie" | "doughnut" | "scatter" | "area" | "radar" | "polar";

export type FilterOperator =
   | "equals"
   | "not_equals"
   | "contains"
   | "starts_with"
   | "ends_with"
   | "greater_than"
   | "less_than"
   | "between"
   | "is_empty"
   | "is_not_empty";

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
   value2?: any; // Para operadores between
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
   stacked: boolean;
}

export interface Report {
   id: string;
   name: string;
   description: string;
   chartConfig: ChartConfig;
   createdAt: Date;
   updatedAt: Date;
}
