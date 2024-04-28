"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable

    const [checkedRow, setCheckedRow] = useState<string>();
    const selectRow = (rowId: string) => {
        setCheckedRow(rowId);
    };
    console.log("rows", table.getRowModel().rows);
    console.log("selected rows", checkedRow);
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table className="custom-stick-class">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="">
                                <TableHead>
                                    <input type="checkbox" />
                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn({
                                        "bg-slate-300": checkedRow === row.id,
                                    })}
                                >
                                    {/* Checkbox */}
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={checkedRow === row.id}
                                            onChange={() => selectRow(row.id)}
                                        />
                                    </TableCell>

                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
