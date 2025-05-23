/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  CirclePlus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import useTask from "@/stores/useTask";
import useAuth from "@/stores/useAuth";
import usePeople from "@/stores/usePeople";
import React, { useEffect } from "react";

export default function TasksPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");
  void assigneeFilter
  const [workspaceFilter, setWorkspaceFilter] = React.useState<string>("all");
  void workspaceFilter

  const navigate = useNavigate();
  const { loading: tasksLoading, getAllTask, tasks } = useTask();
  const { dataUser } = useAuth();
  // const { workspaces, loading: workspacesLoading } = useWorkspace();
  const { getAllPeople } = usePeople();

  const table = useReactTable({
    data: tasks || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Filter handlers
  // const handleAssigneeFilter = (value: string) => {
  //   setAssigneeFilter(value);
  //   if (value === "all") {
  //     table.getColumn("user_id")?.setFilterValue(undefined);
  //   } else {
  //     table.getColumn("user_id")?.setFilterValue(value);
  //   }
  // };

  // const handleWorkspaceFilter = (value: string) => {
  //   setWorkspaceFilter(value);
  //   if (value === "all") {
  //     table.getColumn("workspace_id")?.setFilterValue(undefined);
  //   } else {
  //     table.getColumn("workspace_id")?.setFilterValue(value);
  //   }
  // };

  // Reset all filters
  // const handleResetFilters = () => {
  //   setAssigneeFilter("all");
  //   setWorkspaceFilter("all");
  //   table.getColumn("user_id")?.setFilterValue(undefined);
  //   table.getColumn("workspace_id")?.setFilterValue(undefined);
  //   table.getColumn("title")?.setFilterValue("");
  // };

  useEffect(() => {
    getAllTask();
  }, [getAllTask]);

  useEffect(() => {
    getAllPeople();
  }, [getAllPeople]);

  // Sync filter states with table filters
  useEffect(() => {
    const userIdFilter = table.getColumn("user_id")?.getFilterValue();
    const workspaceIdFilter = table.getColumn("workspace_id")?.getFilterValue();
    setAssigneeFilter(userIdFilter ? String(userIdFilter) : "all");
    setWorkspaceFilter(workspaceIdFilter ? String(workspaceIdFilter) : "all");
  }, [table]);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 pb-28 px-4 pt-0">
        <div>
          <h2 className="md:text-2xl text-lg font-semibold">Tasks</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            A list of all the tasks in your team's project.
          </p>
        </div>
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-2 items-center py-2 md:py-4">
            <Input
              placeholder="Search by title"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="md:max-w-sm w-full"
            />
            <div className="flex gap-2 w-full justify-end flex-wrap">
              {/* Assignee Filter */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex gap-2"
                    disabled={peoplesLoading}
                  >
                    {peoplesLoading ? (
                      <Skeleton className="w-16 h-4" />
                    ) : (
                      <>
                        <Users size={16} />
                        <span>Assignee</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="px-2 py-1">
                    Filter by Assignee
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    onValueChange={handleAssigneeFilter}
                    value={assigneeFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Assignees
                    </DropdownMenuRadioItem>
                    {peoples && peoples.length > 0 ? (
                      peoples
                        .filter((assignee) => assignee.id != null)
                        .map((assignee) => (
                          <DropdownMenuRadioItem
                            key={assignee.id}
                            value={String(assignee.id)}
                          >
                            {assignee.name}
                          </DropdownMenuRadioItem>
                        ))
                    ) : (
                      <DropdownMenuRadioItem value="" disabled>
                        No assignees available
                      </DropdownMenuRadioItem>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* Workspace Filter */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex gap-2"
                    disabled={workspacesLoading}
                  >
                    {workspacesLoading ? (
                      <Skeleton className="w-16 h-4" />
                    ) : (
                      <>
                        <BriefcaseBusiness size={16} />
                        <span>Workspace</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="px-2 py-1">
                    Filter by Workspace
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    onValueChange={handleWorkspaceFilter}
                    value={workspaceFilter}
                  >
                    <DropdownMenuRadioItem value="all">
                      All Workspaces
                    </DropdownMenuRadioItem>
                    {workspaces && workspaces.length > 0 ? (
                      workspaces
                        .filter((workspace) => workspace.id != null)
                        .map((workspace) => (
                          <DropdownMenuRadioItem
                            key={workspace.id}
                            value={String(workspace.name)}
                          >
                            {workspace.name}
                          </DropdownMenuRadioItem>
                        ))
                    ) : (
                      <DropdownMenuRadioItem value="" disabled>
                        No workspaces available
                      </DropdownMenuRadioItem>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu> */}

              {/* Reset Filters Button */}
              {/* <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button> */}

              {dataUser?.role === "Leader" && (
                <Button
                  variant="blue"
                  onClick={() => navigate("/tasks/create")}
                >
                  <CirclePlus size={16} />
                  <span>Create</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columns <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border w-[calc(100dvw-32px)] md:w-full">
            <Table className="overflow-x-scroll">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {tasksLoading ? (
                  [...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((_column, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="w-full h-6 rounded-md" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
