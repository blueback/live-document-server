// prism syntax highlighting {
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-verilog.min';
// }

function FillTaskDataAndDecorate(data) {
  // Get the table body element
  const tableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
  
  // Loop through the data and create rows
  data.forEach(item => {
    // Create a new row
    const row = document.createElement('tr');
    
    // Create cells for each column in the row
    const cellTaskType = document.createElement('td');
    cellTaskType.textContent = item.taskType;
    row.appendChild(cellTaskType);
  
    const cellTaskNumber = document.createElement('td');
    const preTaskNumber = document.createElement('pre');
    const codeTaskNumber = document.createElement('code');
    codeTaskNumber.className = "language-verilog";
    codeTaskNumber.textContent = item.taskNumber;
    preTaskNumber.appendChild(codeTaskNumber);
    cellTaskNumber.appendChild(preTaskNumber);
    row.appendChild(cellTaskNumber);
  
    const cellTaskPriority = document.createElement('td');
    cellTaskPriority.textContent = item.priority;
    row.appendChild(cellTaskPriority);
  
    const cellTaskDeadline = document.createElement('td');
    cellTaskDeadline.textContent = item.deadline;
    row.appendChild(cellTaskDeadline);
  
    const cellTaskDependency1 = document.createElement('td');
    const preTaskDependency1 = document.createElement('pre');
    const codeTaskDependency1 = document.createElement('code');
    codeTaskDependency1.className = "language-verilog";
    codeTaskDependency1.textContent = item.dependency1;
    preTaskDependency1.appendChild(codeTaskDependency1);
    cellTaskDependency1.appendChild(preTaskDependency1);
    row.appendChild(cellTaskDependency1);
  
    const cellTaskDependency2 = document.createElement('td');
    const preTaskDependency2 = document.createElement('pre');
    const codeTaskDependency2 = document.createElement('code');
    codeTaskDependency2.className = "language-verilog";
    codeTaskDependency2.textContent = item.dependency2;
    preTaskDependency2.appendChild(codeTaskDependency2);
    cellTaskDependency2.appendChild(preTaskDependency2);
    row.appendChild(cellTaskDependency2);
  
    // Append the row to the table body
    tableBody.appendChild(row);
  });


  const tables = document.getElementsByTagName('table');

  for (let i = 0; i < tables.length; i++) {
    tables[i].style.border = '1px solid black';
    tables[i].style.borderCollapse = 'collapse';
  }

  const table_headings = document.getElementsByTagName('th');

  for (let i = 0; i < table_headings.length; i++) {
    table_headings[i].style.border = '1px solid black';
    table_headings[i].style.borderCollapse = 'collapse';
    table_headings[i].style.backgroundColor = 'grey';
  }

  const table_rows = document.getElementsByTagName('tr');

  for (let i = 0; i < table_rows.length; i++) {
    table_rows[i].style.border = '1px solid black';
    table_rows[i].style.borderCollapse = 'collapse';
  }

  const table_data_elements = document.getElementsByTagName('td');

  for (let i = 0; i < table_data_elements.length; i++) {
    table_data_elements[i].style.border = '1px solid black';
    table_data_elements[i].style.borderCollapse = 'collapse';
    for (let j = 0; j < table_data_elements[i].children.length; j++) {
      if (table_data_elements[i].children[j].nodeName === "PRE") {
        //table_data_elements[i].style.backgroundColor = 'lightgrey';
        //table_data_elements[i].style.backgroundColor = '#332822';
        table_data_elements[i].style.backgroundColor = 'grey';
      }
    }
  }

  const pres = document.getElementsByTagName('pre');
  // console.log(pres);
  for (let i = 0; i < pres.length; i++) {
    pres[i].style.border = "3px solid lightblue";
    pres[i].style.borderCollapse = "collapse";
  }

  const codes = document.getElementsByTagName('code');
  // console.log(codes);
  for (let i = 0; i < codes.length; i++) {
    //codes[i].style.border = "3px solid lightblue";
    //codes[i].style.borderCollapse = "collapse";
    codes[i].style.padding = "0";
    codes[i].style.margin = "0";
    codes[i].style.display = "block";
    //codes[i].style.fontSize = "0.75em";
    //codes[i].style.lineHeight = "1.0";
  }

  Prism.highlightAll();
}

{
  fetch("/workflow_data/taskData.json")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      FillTaskDataAndDecorate(data);
    })
    .catch(error => console.error('Error fetching data:', error));

}
