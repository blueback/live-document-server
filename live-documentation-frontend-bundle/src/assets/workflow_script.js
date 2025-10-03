// prism syntax highlighting {
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-verilog.min';
import cytoscape from 'cytoscape';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
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
          label: `${taskData[i].Title}\n(${i})\n(${taskData[i].priority})`,
          priority: taskData[i].priority
        }
      });
  }
  
  // Convert dependencies to Cytoscape edges
  for (let i = 0; i < taskData.length; i++) {
    if ("dependencies" in taskData[i]) {
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

function createTaskFlowGraph3(taskData) {
  // DOT language string (your network definition)
  var dotString = `
    digraph G {
      rankdir=LR;
  `;
  for (let i = 0; i < taskData.length; i++) {
    dotString += `Node${
      i
    } [label=\"${
      taskData[i].Title
    }\\n(${
      i
    })\\n(${
      taskData[i].priority
    })\", shape=rectangle, color=grey, style=filled];\n`;
  }
  
  for (let i = 0; i < taskData.length; i++) {
    if ("dependencies" in taskData[i]) {
      taskData[i].dependencies.forEach(dependency => {
        dotString += `Node${i} -> Node${dependency};`;
      });
    }
  }
  dotString += `
    }
  `;

  // Use Viz.js to render the DOT string into SVG
  const viz = new Viz({ Module, render });
  viz.renderSVGElement(dotString)
    .then(function(svgElement) {
      const resizeToScreenWidth = true;
      if (resizeToScreenWidth) {
        // Get original dimensions
        const width = svgElement.getAttribute('width');
        const height = svgElement.getAttribute('height');

        // Remove fixed width/height so it can scale
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');

        // Set responsive attributes
        svgElement.setAttribute('viewBox', `0 0 ${parseFloat(width)} ${parseFloat(height)}`);
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgElement.style.width = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
      }

      const svg = svgElement;
      document.getElementById("taskGraph").appendChild(svg);

      // Add hover effect to nodes
      svg.querySelectorAll('g.node').forEach(function(node) {

        // Find the actual shape (polygon, ellipse, etc.)
        const shape = node.querySelector('polygon, ellipse, circle');

        if (!shape) return;

        // Save the original fill
        const originalFill = shape.getAttribute('fill') || '#ffffff';

        node.addEventListener('mouseenter', function() {
          // node.style.fill = '#f00'; // Change color on hover
          shape.setAttribute('fill', 'orange');
        });
        node.addEventListener('mouseleave', function() {
          // node.style.fill = ''; // Reset color when not hovered
          shape.setAttribute('fill', originalFill);
        });
      });
    })
    .catch(function(error) {
      console.error(error);
    });
}

function checkDependenciesHaveTotalBaseEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return 1;
  }

  visited[i] = 1;

  if ("totalBaseEstimate" in taskData[i]) {
  } else {
    console.warn("Total base estimate is not present, so assuming 0(check your taskData.json)!!");
    return 0;
  }
  
  if ("dependencies" in taskData[i]) {
    for (let j = 0; j < taskData[i].dependencies.length; j++) {
      if (!checkDependenciesHaveTotalBaseEstimate(taskData, taskData[i].dependencies[j], visited)) {
        return 0;
      }
    }
  }

  return 1;
}

function checkDependenciesHaveRemainingBaseEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return 1;
  }

  visited[i] = 1;

  if ("remainingBaseEstimate" in taskData[i]) {
    if ("totalBaseEstimate" in taskData[i]) {
      if (taskData[i].remainingBaseEstimate > taskData[i].totalBaseEstimate) {
        console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
        return 0;
      }
    } else {
      console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
      return 0;
    }
  } else {
    console.warn("Remaining base estimate is not present, so assuming same as total base estimate(check your taskData.json)!!");
    return 0;
  }
  
  if ("dependencies" in taskData[i]) {
    for (let j = 0; j < taskData[i].dependencies.length; j++) {
      if (!checkDependenciesHaveRemainingBaseEstimate(taskData, taskData[i].dependencies[j], visited)) {
        return 0;
      }
    }
  }

  return 1;
}

function checkAssumptionsOnEstimates(taskData) {
  var visited = [];
  for (let i = 0; i < taskData.length; i++) {
    visited.push(0);
  }
  for (let i = 0; i < taskData.length; i++) {
    for (let j = 0; j < taskData.length; j++) {
      visited[j] = 0;
    }
    taskData[i].totalAggregateEstimateHasAssumptions =
      (checkDependenciesHaveTotalBaseEstimate(taskData, i, visited) == 0);
    for (let j = 0; j < taskData.length; j++) {
      visited[j] = 0;
    }
    taskData[i].remainingAggregateEstimateHasAssumptions =
      (checkDependenciesHaveRemainingBaseEstimate(taskData, i, visited) == 0);
  }
}

function computeTotalAggregateEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return 0;
  }

  visited[i] = 1;

  var currNodeTotalAggregateEstimate = 0;
  if ("totalBaseEstimate" in taskData[i]) {
    currNodeTotalAggregateEstimate = taskData[i].totalBaseEstimate;
  } else {
    console.warn("Total base estimate is not present, so assuming 0(check your taskData.json)!!");
    currNodeTotalAggregateEstimate = 0;
  }
  
  if ("dependencies" in taskData[i]) {
    for (let j = 0; j < taskData[i].dependencies.length; j++) {
      currNodeTotalAggregateEstimate +=
        computeTotalAggregateEstimate(taskData, taskData[i].dependencies[j], visited);
    }
  }

  return currNodeTotalAggregateEstimate;
}

function computeTotalAggregateEstimates(taskData) {
  var visited = [];
  for (let i = 0; i < taskData.length; i++) {
    visited.push(0);
  }
  for (let i = 0; i < taskData.length; i++) {
    for (let j = 0; j < taskData.length; j++) {
      visited[j] = 0;
    }
    taskData[i].totalAggregateEstimate =
      computeTotalAggregateEstimate(taskData, i, visited);
  }
}

function computeRemainingAggregateEstimate(taskData, i, visited) {
  if (visited[i] != 0) {
    return 0;
  }

  visited[i] = 1;

  var currNodeRemainingAggregateEstimate = 0;
  if ("remainingBaseEstimate" in taskData[i]) {
    if ("totalBaseEstimate" in taskData[i]) {
      if (taskData[i].remainingBaseEstimate > taskData[i].totalBaseEstimate) {
        console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
        currNodeRemainingAggregateEstimate = taskData[i].totalBaseEstimate;
      } else {
        currNodeRemainingAggregateEstimate = taskData[i].remainingBaseEstimate;
      }
    } else {
      console.warn("Remaining Base estimate should be less that total Base estimate(check your taskData.json)!!");
      currNodeRemainingAggregateEstimate = 0;
    }
  } else {
    console.warn("Remaining base estimate is not present, so assuming same as total base estimate(check your taskData.json)!!");
    if ("totalBaseEstimate" in taskData[i]) {
      currNodeRemainingAggregateEstimate = taskData[i].totalBaseEstimate;
    } else {
      currNodeRemainingAggregateEstimate = 0;
    }
  }
  
  if ("dependencies" in taskData[i]) {
    for (let j = 0; j < taskData[i].dependencies.length; j++) {
      currNodeRemainingAggregateEstimate +=
        computeRemainingAggregateEstimate(taskData, taskData[i].dependencies[j], visited);
    }
  }

  return currNodeRemainingAggregateEstimate;
}

function computeRemainingAggregateEstimates(taskData) {
  var visited = [];
  for (let i = 0; i < taskData.length; i++) {
    visited.push(0);
  }
  for (let i = 0; i < taskData.length; i++) {
    for (let j = 0; j < taskData.length; j++) {
      visited[j] = 0;
    }
    taskData[i].remainingAggregateEstimate =
      computeRemainingAggregateEstimate(taskData, i, visited);
  }
}

function addTotalWork(data) {
  var dependency_counts = []
  for (let i = 0; i < data.length; i++) {
    dependency_counts.push(0);
  }
  for (let i = 0; i < data.length; i++) {
    if ("dependencies" in data[i]) {
      data[i].dependencies.forEach(dependency => {
        dependency_counts[dependency]++;
      });
    }
  }
  data.push({taskType: "Total Work", Title: "Total Work"});
  data[data.length - 1].dependencies = []
  // console.log(data[data.length - 1]);
  for (let i = 0; i < data.length - 1; i++) {
    if (dependency_counts[i] == 0) {
      data[data.length - 1].dependencies.push(i);
    }
  }
}

function computeExpectedCompletionDates(data) {
  const months = [
    'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug',
    'Sept', 'Oct', 'Nov', 'Dec'
  ];
  const currentDate = new Date();
  // console.log(currentDate);
  for (let i = 0; i < data.length; i++) {
    if ('expectedCompletionDate' in data[i]) {
      console.warn(`overwriting expected completion data!!`);
    }
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate()
      + data[i].remainingAggregateEstimate);
    // const localDate = now.toLocaleDateString();
    // const localTime = now.toLocaleTimeString();
    // const year = now.getFullYear(); // e.g., 2025
    // const month = now.getMonth();   // 0-indexed, so October is 9
    // const day = now.getDate();      // Day of the month (1-31)
    // const hours = now.getHours();   // Hour (0-23)
    // const minutes = now.getMinutes(); // Minute (0-59)
    // const seconds = now.getSeconds(); // Second (0-59)
    const futureYear = futureDate.getFullYear();
    const futureMonth = futureDate.getMonth();
    const futureDay = futureDate.getDate();
    if ('totalBaseEstimate' in data[i]) {
      data[i].expectedCompletionDate = {
        "date": futureDay,
        "month": futureMonth + 1,
        "year": futureYear
      };
    }
  }
}

function printDeadlineDate(deadline) {
  // console.log(deadline);
  const months = [
    'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug',
    'Sept', 'Oct', 'Nov', 'Dec'
  ];
  return `${deadline.date} ${months[deadline.month - 1]} ${deadline.year}`;
}

function calculateDaysBetweenDates(unformatted_date1, unformatted_date2) {
  const date1 = `${unformatted_date1.year}-${unformatted_date1.month}-${unformatted_date1.date}`; // format: YYYY-MM-DD
  const date2 = `${unformatted_date2.year}-${unformatted_date2.month}-${unformatted_date2.date}`; // format: YYYY-MM-DD

  // Convert the date strings into Date objects
  const d1 = new Date(date1); 
  const d2 = new Date(date2);
  
  // Ensure that both dates are valid
  if (isNaN(d1) || isNaN(d2)) {
      return 'Invalid date format';
  }
  
  if (d2 < d1) {
    console.warn(`Date of deadline is smaller than expected completion date`);
  }

  // Get the difference in milliseconds
  const timeDifference = d2 - d1;
  
  // Convert the difference from milliseconds to days (1000ms = 1 second, 60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day)
  var dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (d2 < d1) {
    dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }
  
  return dayDifference;
}

function computeCompletionMarginInDays(data) {
  for (let i = 0; i < data.length; i++) {
    if ("expectedCompletionDate" in data[i] && "deadline" in data[i]) {
      data[i].completionMarginInDays = calculateDaysBetweenDates(data[i].expectedCompletionDate, data[i].deadline);
    }
  }
}

function fillTaskDataAndDecorate(data) {
  // Get the table body element
  const tableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

  addTotalWork(data);

  const tableDependenciesHeading = document.getElementById('tableDependenciesHeading')
  var max_num_dependencies = 1;
  data.forEach(item => {
    if ("dependencies" in item) {
      if (max_num_dependencies < item.dependencies.length) {
        max_num_dependencies = item.dependencies.length;
      }
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

  // Should not sort as it could mess up the dependencies
  //data.sort((a, b) => a.priority - b.priority);

  checkAssumptionsOnEstimates(data);
  computeTotalAggregateEstimates(data);
  computeRemainingAggregateEstimates(data);
  computeExpectedCompletionDates(data);
  computeCompletionMarginInDays(data);

  var sortedIndices = [];
  for (let i = 0; i < data.length - 1; i++) {
    sortedIndices.push(i);
  }
  sortedIndices.sort((a, b) => {
    if ("completionMarginInDays" in data[a] && "completionMarginInDays" in data[b]) {
      return data[a].completionMarginInDays - data[b].completionMarginInDays;
    } else if ("completionMarginInDays" in data[a]) {
      return data[a].completionMarginInDays;
    } else if ("completionMarginInDays" in data[b]) {
      return data[b].completionMarginInDays;
    } else {
      return 0;
    }
  });
  sortedIndices.push(data.length - 1);

  var reverseMapSortedIndices = [];
  for (let i = 0; i < data.length - 1; i++) {
    reverseMapSortedIndices.push(0);
  }
  for (let i = 0; i < sortedIndices.length - 1; i++) {
    reverseMapSortedIndices[sortedIndices[i]] = i;
  }
  
  // Loop through the data and create rows
  for (let i = 0; i < sortedIndices.length; i++) {
    const item = data[sortedIndices[i]];
    // Create a new row
    const row = document.createElement('tr');
  
    const cellTaskSerialNumber = document.createElement('td');
    const preTaskSerialNumber = createUnderCode(i, "language-verilog");
    cellTaskSerialNumber.setAttribute("title", item.Title);
    cellTaskSerialNumber.appendChild(preTaskSerialNumber);
    row.appendChild(cellTaskSerialNumber);
    
    // Create cells for each column in the row
    const cellTaskType = document.createElement('td');
    const taskTitle = document.createElement('details');
    const taskTitleSummary = document.createElement('summary');
    taskTitleSummary.textContent = item.taskType;
    cellTaskType.setAttribute("title", item.Title);
    if ("description" in item) {
      const preTaskTitle =
          createUnderCode("# " + item.Title + "\n\n\"\"\"\n" +
                              item.description.join("\n") + "\n\"\"\"",
                          "language-python");
      taskTitle.appendChild(preTaskTitle);
    } else {
      const preTaskTitle =
          createUnderCode("# " + item.Title, "language-python");
      taskTitle.appendChild(preTaskTitle);
    }
    taskTitle.appendChild(taskTitleSummary);
    cellTaskType.appendChild(taskTitle);
    row.appendChild(cellTaskType);
  
    const cellTaskNumber = document.createElement('td');
    const preTaskNumber = createUnderCode(item.taskNumber, "language-verilog");
    cellTaskNumber.appendChild(preTaskNumber);
    row.appendChild(cellTaskNumber);
  
    const cellTaskDeadline = document.createElement('td');
    if ('deadline' in item) {
      cellTaskDeadline.textContent = printDeadlineDate(item.deadline);
      cellTaskDeadline.setAttribute("align", "center");
    }
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
      if ("totalAggregateEstimateHasAssumptions" in item && item.totalAggregateEstimateHasAssumptions == 1) {
        cellTaskTotalAggrEstimate.textContent = `${item.totalAggregateEstimate} (assumptions)`;
      } else {
        cellTaskTotalAggrEstimate.textContent = item.totalAggregateEstimate;
      }
      cellTaskTotalAggrEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskTotalAggrEstimate);
  
      const cellTaskRemainingAggrEstimate = document.createElement('td');
      if ("remainingAggregateEstimateHasAssumptions" in item && item.remainingAggregateEstimateHasAssumptions == 1) {
        cellTaskRemainingAggrEstimate.textContent = `${item.remainingAggregateEstimate} (assumptions)`;
      } else {
        cellTaskRemainingAggrEstimate.textContent = item.remainingAggregateEstimate;
      }
      cellTaskRemainingAggrEstimate.setAttribute("align", "center");
      row.appendChild(cellTaskRemainingAggrEstimate);
    }

    const cellExpectedCompletionDate = document.createElement('td');
    if ("expectedCompletionDate" in item) {
      cellExpectedCompletionDate.textContent = printDeadlineDate(item.expectedCompletionDate);
    }
    cellExpectedCompletionDate.setAttribute("align", "center");
    row.appendChild(cellExpectedCompletionDate);
  
    const cellCompletionMarginInDays = document.createElement('td');
    if ("completionMarginInDays" in item) {
      if (item.completionMarginInDays < 0) {
        cellCompletionMarginInDays.textContent = `${item.completionMarginInDays} (overdue)`;
      } else {
        cellCompletionMarginInDays.textContent = `${item.completionMarginInDays} (early)`;
      }
    }
    cellCompletionMarginInDays.setAttribute("align", "center");
    row.appendChild(cellCompletionMarginInDays);
  
    const cellTaskPriority = document.createElement('td');
    cellTaskPriority.textContent = item.priority;
    cellTaskPriority.setAttribute("align", "center");
    row.appendChild(cellTaskPriority);
  
    if ("dependencies" in item) {
      item.dependencies.forEach(dependency => {
        const cellTaskDependency = document.createElement('td');
        const preTaskDependency = document.createElement('pre');
        const codeTaskDependency = document.createElement('code');
        codeTaskDependency.className = "language-verilog";
        codeTaskDependency.textContent = reverseMapSortedIndices[dependency];
        preTaskDependency.appendChild(codeTaskDependency);
        cellTaskDependency.setAttribute("title", data[dependency].Title);
        cellTaskDependency.appendChild(preTaskDependency);
        row.appendChild(cellTaskDependency);
      });
    }
  
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
      // console.log(data);
      fillTaskDataAndDecorate(data);
      createTaskFlowGraph3(data);
    })
    .catch(error => console.error('Error fetching data:', error));

}
