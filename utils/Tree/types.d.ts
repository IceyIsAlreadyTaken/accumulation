interface IDataItem {
  paramName: string;
  label: string;
  required: boolean;
  description: string;
  children: IDataItem[];
  folded?: boolean;
}
