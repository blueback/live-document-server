// prism syntax highlighting {
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-verilog.min';
import cytoscape from 'cytoscape';
// }

function createUnderCode(content, lang) {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = lang;
  code.textContent = content;
  pre.appendChild(code);
  return pre;
}

function createTaskFlowGraph(taskData) {
  // Your graph data and configuration code (same as above)
  const adjacencyList = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"]
  };
  
  const nodes = [];
  const edges = [];
  
  for (const vertex in adjacencyList) {
    nodes.push({ data: { id: vertex, label: vertex } });
  }
  
  for (const vertex in adjacencyList) {
    adjacencyList[vertex].forEach(neighbor => {
      edges.push({ data: { source: vertex, target: neighbor, label: `${vertex}-${neighbor}` } });
    });
  }
  console.log(nodes);
  console.log(edges);
  
  const cy = cytoscape({
    container: document.getElementById('taskGraph'),
    elements: [...nodes, ...edges],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#0074d9',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': '30px',
          'height': '30px'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'label': 'data(label)',
          'color': '#ccc',
          'text-rotation': 'autorotate',
          'text-opacity': 0.8
        }
      }
    ],
    layout: {
      name: 'grid',
      rows: 5
    }
  });
}

function createTaskFlowGraph2(taskData) {
  const nodes = [];
  const edges = [];

  // Convert tasks to Cytoscape nodes
  for (let i = 0; i < taskData.length; i++) {
    nodes.push(
      {
        data:
        {
          id: i,
          label: `${taskData[i].Title.slice(1,-1)}\n(${i})\n(${taskData[i].priority})`,
          priority: taskData[i].priority
        }
      });
  }
  
  // Convert dependencies to Cytoscape edges
  for (let i = 0; i < taskData.length; i++) {
    taskData[i].dependencies.forEach(dependency => {
      edges.push(
        {
          data:
          {
            source: i,
            target: dependency,
            label: `${i}-${dependency}`
          }
        });
    });
  }
  
  // Priority color mapping
  const priorityColor = {
    1: '#e74c3c',
    2: '#f39c12',
    3: '#2ecc71'
  };
  
  // Initialize Cytoscape
  const cy = cytoscape({
    container: document.getElementById('taskGraph'),
    elements: [...nodes, ...edges],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': ele => priorityColor[ele.data('priority')],
          'label': 'data(label)',
          'color': '#325',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '10px',
          'text-wrap': 'wrap',
          'text-max-width': '80px',
          //'width': '80px',
          //'height': '40px',
          'width': 'label',
          'height': 'label',
          'shape': 'roundrectangle'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#999',
          'target-arrow-color': '#999',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'arrow-scale': 1.2,
          'label': 'data(label)',
          'font-size': '8px',
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
          'color': '#666'
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      spacingFactor: 1.5
    }
  });
}

function computeTotalAggregateEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return;
  }

  visited[i] = 1;

  if ("totalBaseEstimate" in taskData[i]) {
    taskData[i].totalAggregateEstimate = taskData[i].totalBaseEstimate;
  } else {
    console.warn("Total base estimate is not present, so assuming 0(check your taskData.json)!!");
    taskData[i].totalAggregateEstimate = 0;
  }
  
  for (let j = 0; j < taskData[i].dependencies.length; j++) {
    computeTotalAggregateEstimate(taskData, taskData[i].dependencies[j], visited);
    taskData[i].totalAggregateEstimate +=
      taskData[taskData[i].dependencies[j]].totalAggregateEstimate;
  }
}

function computeTotalAggregateEstimates(taskData) {
  var visited = [];
  for (let i = 0; i < taskData.length; i++) {
    visited.push(0);
  }
  for (let i = 0; i < taskData.length; i++) {
    computeTotalAggregateEstimate(taskData, i, visited);
  }
}

function computeRemainingAggregateEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return;
  }

  visited[i] = 1;

  if ("remainingBaseEstimate" in taskData[i]) {
    if ("totalBaseEstimate" in taskData[i]) {
      if (taskData[i].remainingBaseEstimate > taskData[i].totalBaseEstimate) {
        console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
        taskData[i].remainingAggregateEstimate = taskData[i].totalBaseEstimate;
      } else {
        taskData[i].remainingAggregateEstimate = taskData[i].remainingBaseEstimate;
      }
    } else {
      console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
      taskData[i].remainingAggregateEstimate = 0;
    }
  } else {
    console.warn("Remaining base estimate is not present, so assuming same as total base estimate(check your taskData.json)!!");
    if ("totalBaseEstimate" in taskData[i]) {
      taskData[i].remainingAggregateEstimate = taskData[i].totalBaseEstimate;
    } else {
      taskData[i].remainingAggregateEstimate = 0;
    }
  }
  
  for (let j = 0; j < taskData[i].dependencies.length; j++) {
    computeRemainingAggregateEstimate(taskData, taskData[i].dependencies[j], visited);
    taskData[i].remainingAggregateEstimate +=
      taskData[taskData[i].dependencies[j]].remainingAggregateEstimate;
  }
}

function computeRemainingAggregateEstimates(taskData) {
  var visited = [];
  for (let i = 0; i < taskData.length; i++) {
    visited.push(0);
  }
  for (let i = 0; i < taskData.length; i++) {
    computeRemainingAggregateEstimate(taskData, i, visited);
  }
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
    dependencySubHeading.setAttribute("rowspan", "2");
    taskSubHeadingRow.appendChild(dependencySubHeading);
  }

  data.sort((a, b) => a.priority - b.priority);

  computeTotalAggregateEstimates(data);
  computeRemainingAggregateEstimates(data);
  
  // Loop through the data and create rows
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    // Create a new row
    const row = document.createElement('tr');
  
    const cellTaskSerialNumber = document.createElement('td');
    const preTaskSerialNumber = createUnderCode(i, "language-verilog");
    cellTaskSerialNumber.appendChild(preTaskSerialNumber);
    row.appendChild(cellTaskSerialNumber);
    
    // Create cells for each column in the row
    const cellTaskType = document.createElement('td');
    const taskTitle = document.createElement('details');
    const taskTitleSummary = document.createElement('summary');
    taskTitleSummary.textContent = item.taskType;
    const preTaskTitle = createUnderCode(item.Title, "language-python");
    taskTitle.appendChild(preTaskTitle);
    taskTitle.appendChild(taskTitleSummary);
    cellTaskType.appendChild(taskTitle);
    row.appendChild(cellTaskType);
  
    const cellTaskNumber = document.createElement('td');
    const preTaskNumber = createUnderCode(item.taskNumber, "language-verilog");
    cellTaskNumber.appendChild(preTaskNumber);
    row.appendChild(cellTaskNumber);
  
    const cellTaskDeadline = document.createElement('td');
    cellTaskDeadline.textContent = item.deadline;
    row.appendChild(cellTaskDeadline);
  
    {
      const cellTaskTotalBaseEstimate = document.createElement('td');
      if ("totalBaseEstimate" in item) {
        cellTaskTotalBaseEstimate.textContent = item.totalBaseEstimate;
      } else {
        console.warn(`Total base estimate is not present for ${i}th task!!`);
        cellTaskTotalBaseEstimate.textContent = "0(default)";
      }
      cellTaskTotalBaseEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskTotalBaseEstimate);
  
      const cellTaskRemainingBaseEstimate = document.createElement('td');
      if ("remainingBaseEstimate" in item) {
        if ("totalBaseEstimate" in item) {
          if (item.remainingBaseEstimate > item.totalBaseEstimate) {
            console.warn(`Remaining Base estimate should be less that total Base estimate for ${i}th task!!`);
            cellTaskRemainingBaseEstimate.textContent = `${cellTaskTotalBaseEstimate.textContent}(adjusted)`;
          } else {
            cellTaskRemainingBaseEstimate.textContent = item.remainingBaseEstimate;
          }
        } else {
          console.warn(`Remaining Base estimate should be less that total Base estimate for ${i}th task!!`);
          cellTaskRemainingBaseEstimate.textContent = `${cellTaskTotalBaseEstimate.textContent}(adjusted)`;
        }
      } else {
        console.warn(`Remaining base estimate is not present for ${i}th task!!`);
        if ("totalBaseEstimate" in item) {
          cellTaskRemainingBaseEstimate.textContent = `${cellTaskTotalBaseEstimate.textContent}(default)`;
        } else {
          cellTaskRemainingBaseEstimate.textContent = "0(default)";
        }
      }
      cellTaskRemainingBaseEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskRemainingBaseEstimate);
    }

    {
      const cellTaskTotalAggrEstimate = document.createElement('td');
      cellTaskTotalAggrEstimate.textContent = item.totalAggregateEstimate;
      cellTaskTotalAggrEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskTotalAggrEstimate);
  
      const cellTaskRemainingAggrEstimate = document.createElement('td');
      cellTaskRemainingAggrEstimate.textContent = item.remainingAggregateEstimate;
      cellTaskRemainingAggrEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskRemainingAggrEstimate);
    }

    const cellExpectedCompletionDate = document.createElement('td');
    cellExpectedCompletionDate.textContent = item.expectedCompletionDate;
    cellExpectedCompletionDate.setAttribute("align", "center");
    row.appendChild(cellExpectedCompletionDate);
  
    const cellTaskPriority = document.createElement('td');
    cellTaskPriority.textContent = item.priority;
    cellTaskPriority.setAttribute("align", "center");
    row.appendChild(cellTaskPriority);
  
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
  }


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
      createTaskFlowGraph2(data);
    })
    .catch(error => console.error('Error fetching data:', error));

}
