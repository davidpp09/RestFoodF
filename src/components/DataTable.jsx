import React from "react"
import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

// ✅ AGREGAR onEdit y onDelete como props
export function DataTable({ columns, data, onEdit, onDelete, onPassword }) {
    const [columnFilters, setColumnFilters] = React.useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        // ✅ AGREGAR meta para pasar los callbacks
        meta: {
            onEdit,
            onDelete,
            onPassword
        }
    })

    return (
        <div className="rounded-md border border-rf-border">
            <div className="flex items-center py-4 px-4">
                <Input
                    placeholder="Filtrar por nombre..."
                    value={(table.getColumn("nombre")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nombre")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-rf-bg border-rf-border-strong text-rf-text placeholder:text-rf-text-3 rounded-md"
                />
            </div>
            <Table>
                <TableHeader className="bg-rf-surface-2">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-rf-border hover:bg-transparent">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-rf-text-3 font-bold text-xs uppercase tracking-[.1em]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="border-rf-border hover:bg-rf-surface-2/60 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-rf-text-3">
                                No hay resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}