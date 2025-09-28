// prism syntax highlighting {
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-verilog.min';
// }

function createUnderCode(content, lang) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = lang;
  code.textContent = content;
  pre.appendChild(code);
  return pre;
}

function fillTaskDataAndDecorate(data) {
  // Get the table body element
  const tableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

  const tableDependenciesHeading = document.getElementById('tableDependenciesHeading')
  var max_num_dependencies = 1;
  data.forEach(item => {
    if (max_num_dependencies < item.dependencies.length) {
      max_num_dependencies = item.dependencies.length;
    }
  });
  tableDependenciesHeading.setAttribute("colspan", max_num_dependencies);

  const taskSubHeadingRow = document.getElementById('taskSubHeadingRow')
  for (let i = 0; i < max_num_dependencies; i++) {
    const dependencySubHeading = document.createElement('th');
    dependencySubHeading.textContent = `Dependency ${i+1}`;
    dependencySubHeading.setAttribute("align", "center");
    taskSubHeadingRow.appendChild(dependencySubHeading);
  }

  data.sort((a, b) => a.priority - b.priority);
  
  // Loop through the data and create rows
  data.forEach(item => {
    // Create a new row
    const row = document.createElement('tr');
    
    // Create cells for each column in the row
    const cellTaskType = document.createElement('td');
    const taskDescription = document.createElement('details');
    const taskDescriptionSummary = document.createElement('summary');
    taskDescriptionSummary.textContent = item.taskType;
    const preTaskTitle = createUnderCode(item.Title, "language-python");
    taskDescription.appendChild(preTaskTitle);
    taskDescription.appendChild(taskDescriptionSummary);
    cellTaskType.appendChild(taskDescription);
    row.appendChild(cellTaskType);
  
    const cellTaskNumber = document.createElement('td');
    const preTaskNumber = createUnderCode(item.taskNumber, "language-verilog");
    cellTaskNumber.appendChild(preTaskNumber);
    row.appendChild(cellTaskNumber);
  
    const cellTaskPriority = document.createElement('td');
    cellTaskPriority.textContent = item.priority;
    cellTaskPriority.setAttribute("align", "center");
    row.appendChild(cellTaskPriority);
  
    const cellTaskDeadline = document.createElement('td');
    cellTaskDeadline.textContent = item.deadline;
    row.appendChild(cellTaskDeadline);
  
    const cellTaskBaseEstimate = document.createElement('td');
    cellTaskBaseEstimate.textContent = item.baseEstimate;
    cellTaskBaseEstimate.setAttribute("align", "center");
    row.appendChild(cellTaskBaseEstimate);
  
    item.dependencies.forEach(dependency => {
      const cellTaskDependency = document.createElement('td');
      const preTaskDependency = document.createElement('pre');
      const codeTaskDependency = document.createElement('code');
      codeTaskDependency.className = "language-verilog";
      codeTaskDependency.textContent = dependency;
      preTaskDependency.appendChild(codeTaskDependency);
      cellTaskDependency.appendChild(preTaskDependency);
      row.appendChild(cellTaskDependency);
    });
  
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
      fillTaskDataAndDecorate(data);
    })
    .catch(error => console.error('Error fetching data:', error));

}
