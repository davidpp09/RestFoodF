import React from "react"
import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import FormularioNuevoEmpleado from "@/pages/personal/FormularioNuevoEmpleado"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

export function DataTable({ columns, data }) {
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
    })

    return (
        <div className="rounded-md border border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 pl-3 pr-3">
                {/* El buscador queda a la izquierda */}
                <div className="w-1/2 md:w-1/2">
                    <Input
                        placeholder="Filtrar por nombre..."
                        value={(table.getColumn("nombre")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("nombre")?.setFilterValue(event.target.value)
                        }
                        className="bg-slate-950 border-slate-800 text-white"
                    />
                </div>

                {/* El botón de acción queda a la derecha */}
                <FormularioNuevoEmpleado />

            </div>
            <Table>
                <TableHeader className="bg-slate-950">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-slate-800 hover:bg-transparent">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="text-slate-400 font-bold">
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
                                className="border-slate-800 hover:bg-slate-800/50 transition-colors"
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
                            <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                                No hay resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}