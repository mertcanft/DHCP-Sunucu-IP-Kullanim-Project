import React, { useState } from "react";
import "./App.css";
import MaterialTable from "material-table";
import XLSX from "xlsx";

const EXTENSIONS = ["xlsx", "xls", "csv"];
function App() {
  const [colDefs, setColDefs] = useState();
  const [data, setData] = useState();
  const getExention = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension); // return boolean
  };

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    return rows;
  };

  const importExcel = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      //get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      // console.log(fileData)
      const headers = fileData[0];
      const heads = headers.map((head) => ({ title: head, field: head }));
      setColDefs(heads);

      //removing header
      fileData.splice(0, 1);

      setData(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel, CSV file");
      }
    } else {
      setData([]);
      setColDefs([]);
    }
  };

  return (
    <div className="App">
      <h1 align="center">
        X FİRMA DHCP Sunucu IP Kullanım Raporu Saat 15:00 Tarih 09.09.22
      </h1>
      <h4 align="center">
        <span className="yellow">DİKKAT</span> 80% Kullanım Durumunda.{" "}
        <span className="red">TEHLİKE</span> durumu ve eposta alarmı 90% IP
        kullanımı olduğunda gönderilir.
      </h4>
      <input type="file" onChange={importExcel} />
      <MaterialTable
        className="table"
        title="LOREM"
        data={data}
        columns={colDefs}
        options={{
          sorting: true,
          search: true,
          searchFieldAlignment: "right",
          searchAutoFocus: true,
          searchFieldVariant: "standard",
          filtering: true,
          paging: true,
          pageSizeOptions: [2, 5, 10, 20, 25, 50, 100, 200],
          pageSize: 5,
          paginationType: "stepped",
          showFirstLastPageButtons: false,
          paginationPosition: "both",
          exportButton: true,
          exportAllData: true,
          exportFileName: "TableData",
          addRowPosition: "first",
          actionsColumnIndex: -1,
          selection: true,
          showSelectAllCheckbox: false,
          showTextRowsSelected: false,
          selectionProps: (rowData) => ({
            disabled: rowData.KullanılanIP == null,
            // color:"primary"
          }),
          grouping: true,
          columnsButton: true,
          rowStyle: (data, index) =>
            index % 2 === 0 ? { background: "#f5f5f5" } : null,
          headerStyle: { background: "#343a40", color: "#fff" },
        }}
      />
    </div>
  );
}

export default App;
