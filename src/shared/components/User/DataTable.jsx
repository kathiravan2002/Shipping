/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function Datatable ({totalUsers, globalFilter, filterValues, actionBodyTemplate, multiSelectFilterTemplate, statusBodyTemplate}) {

    return (
        <>
          <DataTable
                  value={totalUsers}
                  paginator
                  rows={10}
                  scrollable
                  scrollHeight="650px"
                  showGridlines
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  tableStyle={{ minWidth: "25rem" }}
                  className="text-sm text-gray-700 border border-gray-200 rounded-lg p-datatable-striped"
                  emptyMessage="No users found."
                  filterDisplay="menu"
                  globalFilter={globalFilter}
                  filters={filterValues}
                >
                  <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
                  <Column header="Actions" body={actionBodyTemplate} />
                  <Column
                    field="Name"
                    header="Name"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "Name")}
                    className="font-medium text-indigo-600"
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="role"
                    header="Role"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "role")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
        
                  <Column
                    field="email"
                    header="Email"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "email")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="password"
                    header="Password"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "password")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="ContactNo"
                    header="Contact No"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "ContactNo")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="Dob"
                    header="Date of Birth"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "Dob")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="Doj"
                    header="Date of Joining"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "Doj")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    field="region"
                    header="Region"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "region")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                  <Column
                    header="Status"
                    body={statusBodyTemplate}
                    field="status"
                    filter
                    filterElement={(options) => multiSelectFilterTemplate(options, "status")}
                    showFilterMenu
                    showFilterMatchModes={false}
                  />
                </DataTable>
        </>
    )
}