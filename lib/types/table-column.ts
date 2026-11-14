export interface TableColumn<TSortField extends string = never> {
  label: string
  className: string
  sortField?: TSortField
}
