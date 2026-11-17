export interface TableColumn<TSortField extends string = never> {
  labelMessageKey: string
  className: string
  sortField?: TSortField
}
