export interface ChartData {
  name: string;
  series: ChartDataPont[];
}

export interface ChartDataPont {
  name: string | number;
  value: string | number;
}
