(function () {
    var DELIMITER = ',';
    var NEWLINE = '\n';
    var qRegex = /^"|"$/g;
    var i = document.getElementById('file');
    var table = document.getElementById('table');
    var addButton = document.getElementById('addButton');
    // addButton.addEventListener('click', addDataToCSV);
    var downloadButton = document.getElementById('downloadButton');

    if (!i) {
        return;
    }

    i.addEventListener('change', function () {
        if (!!i.files && i.files.length > 0) {
            parseCSV(i.files[0]);
        }
    });

    function parseCSV(file) {
        if (!file || !FileReader) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            toTable(e.target.result);
        };

        reader.readAsText(file);
    }

    function toTable(text) {
        if (!text || !table) {
            return;
        }

        // clear table
        while (!!table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }

        var rows = text.split(NEWLINE);
        var headers = rows.shift().trim().split(DELIMITER);
        var htr = document.createElement('tr');

        headers.forEach(function (h) {
            var th = document.createElement('th');
            var ht = h.trim();

            if (!ht) {
                return;
            }

            th.textContent = ht.replace(qRegex, '');
            htr.appendChild(th);
        });

        table.appendChild(htr);

        var rtr;

        rows.forEach(function (r) {
            r = r.trim();

            if (!r) {
                return;
            }

            var cols = r.split(DELIMITER);

            if (cols.length === 0) {
                return;
            }

            rtr = document.createElement('tr');

            cols.forEach(function (c) {
                var td = document.createElement('td');
                var tc = c.trim();

                td.textContent = tc.replace(qRegex, '');
                rtr.appendChild(td);
            });

            table.appendChild(rtr);
        });
        addButton.addEventListener('click', addDataToCSV);
        function addDataToCSV() {
            var userInput = document.getElementById('userInput').value.trim();
            if (!userInput) {
              return;
            }
            
            // Split user input by comma (delimiter)
            var newData = userInput.split(DELIMITER);
            
            // Create a new table row (tr) element
            var newRow = document.createElement('tr');
            
            // Add each data point from user input to a table cell (td) element
            newData.forEach(function (data) {
              var cell = document.createElement('td');
              cell.textContent = data.trim().replace(qRegex, '');
              newRow.appendChild(cell);
            });
            
            // Append the new row to the table
            table.appendChild(newRow);
            
            // Clear the user input field
            document.getElementById('userInput').value = "";
            
            // Send notification to server (simulate writing to file)
            sendUpdateToServer(newData);
          }
          
          function sendUpdateToServer(data) {
            // Replace with your actual server-side communication logic (e.g., Ajax request)
            console.log("Simulating sending update to server:", data);
            // You can potentially send data (newData) to your server using an Ajax request here.
          }
          downloadButton.addEventListener('click', downloadModifiedCSV);
          function downloadModifiedCSV() {
            // Existing table data (assuming you want to keep existing data)
            var existingData = [];
            for (var i = 1; i < table.rows.length; i++) {
              var row = table.rows[i];
              var rowData = [];
              for (var j = 0; j < row.cells.length; j++) {
                rowData.push(row.cells[j].textContent);
              }
              existingData.push(rowData);
            }
            
            // Combine existing and new data
            var allData = existingData.concat([newData]);
            
            // Create the CSV string
            var csvContent = '';
            allData.forEach(function (row) {
              csvContent += row.join(DELIMITER) + NEWLINE;
            });
            
            // Download functionality (using a Blob)
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            var url = window.URL.createObjectURL(blob);
            var downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = "modified_data.csv";
            downloadLink.click();
            window.URL.revokeObjectURL(url);
          }
          
    }
})();