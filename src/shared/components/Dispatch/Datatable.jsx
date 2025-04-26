/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";

export default function Datatable ({dispatch,visible,setVisible,handleInputChange,formData,updateOrder,CONSIGNEE_STATUS,getNextAllowedStatuses,filters,setFilters,
    getDispatcheddate,getDispatchedTime,actionBodyTemplate,multiSelectFilterTemplate,handleImageUpload
}) {

    return (
        <>
        <div className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <Dialog
            header="Edit Consignee Status"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "25vw" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          >
            <h2 className="mb-2 text-lg font-semibold">Update Consignee Status</h2>
            <select
              name="cstatus"
              value={formData.cstatus || ""}
              onChange={handleInputChange}
              className="w-full p-4 mb-4 border-2 rounded bg-purple-50 focus:outline-none focus:ring-purple-400 focus:ring-2"
              required
            >
              {getNextAllowedStatuses(formData.cstatus || CONSIGNEE_STATUS.DISPATCHED).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {formData.cstatus === CONSIGNEE_STATUS.DELIVERED && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="p-4 mb-2 border-2 rounded focus:outline-none focus:ring-purple-400 focus:ring-2 bg-violet-50"
                capture="environment"
              />
            )}
            <div className="flex justify-end">
              <Button label="Update Status" onClick={updateOrder} className="p-button-primary" />
            </div>
          </Dialog>

          <DataTable
            value={dispatch}
            paginator
            rows={10}
            scrollable
            scrollHeight="650px"
            showGridlines
            rowsPerPageOptions={[10, 25, 50, 100]}
            tableStyle={{ minWidth: "25rem" }}
            className="text-sm text-gray-700 border border-gray-200 rounded-lg p-datatable-striped"
            emptyMessage="No order found."
            filters={filters}
            filterDisplay="menu"
            onFilter={(e) => setFilters(e.filters)}
          >
            <Column
              header="S.No"
              body={(rowData, { rowIndex }) => rowIndex + 1}
              
            />
              <Column
                header="Action"
                body={actionBodyTemplate}
                // style={{ width: '10%' }}
              />
            <Column
              field="cid"
              header="Consignee Id"
              style={{ width: '10%' }}
              bodyClassName="text-sky-700"
              filter
              showFilterMatchModes={false}
              filterElement={(options) => multiSelectFilterTemplate(options, 'cid', 'Select IDs')}
            />
              <Column
                field="cstatus"
                header="Status"
                style={{ width: '10%' }}
                bodyClassName="text-green-600"
                filter
                filterElement={(options) => multiSelectFilterTemplate(options, 'cstatus', 'Select Status')}
                showFilterMatchModes={false}
  
              />
            <Column
              header="Dispatched Date"
              body={(rowData) => getDispatcheddate(rowData.statusHistory)}
              style={{ width: '10%' }}
              // showFilterMatchModes={false}
              // filter
              // filterElement={(options) => multiSelectFilterTemplate(options, 'getDispatcheddate', 'Select Date')}
            />
            <Column
              header="Dispatched Time"
              body={(rowData) => getDispatchedTime(rowData.statusHistory)}
              style={{ width: '10%' }}
            />
            <Column
              field="Consigneename"
              header="Consignee Name"
              style={{ width: '12%' }}
              bodyClassName="text-indigo-600"
              showFilterMatchModes={false}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'Consigneename', 'Select Names')}
            />
            <Column
              field="consigneemobileno"
              header="Mobile no"
              style={{ width: '10%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneemobileno' , 'Select mobileno')}
              showFilterMatchModes={false}
            />
            <Column
              field="consigneeaddress"
              header="Consignee Address"
              style={{ width: '10%' }}
            />
            <Column
              field="consigneeedistrict"
              header="Consignee District"
              style={{ width: '10%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneeedistrict', 'Select Districts')}
              showFilterMatchModes={false}

            />
            <Column
              field="consigneepin"
              header="Consignee Pincode"
              style={{ width: '8%' }}
              filter
              filterElement={(options) => multiSelectFilterTemplate(options, 'consigneepin','select pincode')}
              showFilterMatchModes={false}
            />
          </DataTable>        
        </div>
        </>
    )
}