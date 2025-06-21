export interface ColumnsSchema {
    Field: string
    Type: string
    Null: string
    Key: string
    Default: null | string
    Extra: string
}

export function filterColumns(columns: ColumnsSchema[], excludedColumns: string[]) {
    return columns
        .map(columnInfo => columnInfo.Field)
        .filter(colName => !excludedColumns.includes(colName))
        .join(", ")
}