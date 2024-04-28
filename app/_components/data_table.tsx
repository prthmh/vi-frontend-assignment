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
import { MouseEvent, useEffect, useRef, useState } from "react";
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
    const columnWidthRef = useRef<HTMLTableRowElement>();
    const columnClick = (e: any) => {
        console.log(e.target);
        let tdElement = e.target;

        do {
            let parent = tdElement.parentNode;
            console.log("parent", parent);
            tdElement = parent;
        } while (tdElement.tagName.toLowerCase() !== "td");
        console.log(tdElement);
        columnWidthRef.current = tdElement;
        // tdElement.style.width = "20px";
    };

    const increaseWidth = () => {
        const element = columnWidthRef.current;
        if (element) {
            const currentWidth = element.clientWidth;
            element.style.width = `${currentWidth + 10}px`;
        }
    };
    const decreaseWidth = () => {
        const element = columnWidthRef.current;
        if (element) {
            const currentWidth = element.clientWidth;
            element.style.width = `${currentWidth - 10}px`;
        }
    };

    const [checkedRow, setCheckedRow] = useState<string>();
    const selectRow = (rowId: string) => {
        setCheckedRow(rowId);
    };
    console.log(checkedRow);
    return (
        <div className="space-y-4">
            <div className=" flex gap-3 text-white items-center">
                <button onClick={increaseWidth} className=" bg-blue-700 text-lg px-2 rounded-md">
                    +
                </button>
                <button onClick={decreaseWidth} className=" bg-red-600 text-lg px-2 rounded-md">
                    -
                </button>
                <span className=" font-medium text-base text-black">
                    (Select a column to change the column width)
                </span>
            </div>
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
                                    onClick={(e) => columnClick(e)}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn("overflow-hidden", {
                                        "bg-slate-300": checkedRow === row.id,
                                    })}
                                >
                                    {/* Checkbox */}
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={checkedRow === row.id}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                selectRow(row.id);
                                            }}
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
