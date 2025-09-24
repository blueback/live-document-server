// prism syntax highlighting {
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-verilog.min';
// }

{
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

  const matrix01 = document.getElementById('matrix01');
  console.log(matrix01)

  for (let i = 0; i < codes.length; i++) {
    if (codes[i].id == "matrix01") {
      console.assert(codes[i] == matrix01, "a simple assert");
      codes[i].textContent = `A = [[2, 3],
      [4, 5]]
# A is a 2x2 matrix`;
    }
  }

  const determinant01 = document.getElementById('determinant01');
  console.log(determinant01)

  if (determinant01) {
    determinant01.textContent = "det(A) = 2*5 - 3*4 - 3 ";
  }

  Prism.highlightAll();

  /*Video related code*/
  /*
  const videoList = document.getElementById('videoList');
  const searchInput = document.getElementById('searchInput');
  const searchCount = document.getElementById('searchCount');
  const searchKeywords1 = document.getElementById('searchKeywords1');
  const searchKeywords2 = document.getElementById('searchKeywords2');

  videos_data = [];
  // {
  {% for file in files %}
    //console.log("{{ file.video_path }}\n");
    //console.log("{{ file.name }}\n");
    video_data = {
      "name" : "{{ file.name }}",
      "video_path" : "{{ file.video_path }}",
      "thumbnails" : []
    }
    {% for thumbnail in file.thumbnails %}
      //console.log("  :-> thumbnail\n");
      video_data["thumbnails"].push("{{ thumbnail }}")
    {% endfor %}
    videos_data.push(video_data)
  {% endfor %}
  //console.log(videos_data)
  // }

  // collect keywords1 from server
  // {
  keywords1 = [];
  {% for kw1 in keywords %}
    keywords1.push("{{ kw1 }}")
  {% endfor %}
  // }

  // collect keywords2 from server
  // {
  keywords2 = [];
  {% for kw2 in title_keywords %}
    keywords2.push("{{ kw2 }}")
  {% endfor %}
  // }

  // Initial population of the file list
  function displayKeywords(list_of_keywords, list_of_title_keywords) {
    searchKeywords1.innerHTML = '';
    searchKeywords2.innerHTML = '';
    list_of_keywords.forEach(kw1 => {
      const kw_button = document.createElement('button');
      kw_button.textContent = kw1;
      kw_button.addEventListener('click', (e) => {
        searchInput.value = kw1;
        console.log("Button value");
        console.log(searchInput.value);
        const searchCountQuery = parseInt(searchCount.value);
        const searchQuery = searchInput.value;
        const filteredFiles = searchFiles(searchQuery);
        if (!Number.isNaN(searchCountQuery)) {
          displayFiles(filteredFiles.slice(0, searchCountQuery));
        } else {
          displayFiles(filteredFiles.slice(0, 10));
        }
      });
      searchKeywords1.appendChild(kw_button);
    });
    list_of_title_keywords.forEach(kw2 => {
      const kw_button = document.createElement('button');
      kw_button.textContent = kw2;
      searchKeywords2.appendChild(kw_button);
      kw_button.addEventListener('click', (e) => {
        searchInput.value = kw2;
        console.log("Button value");
        console.log(searchInput.value);
        const searchCountQuery = parseInt(searchCount.value);
        const searchQuery = searchInput.value;
        const filteredFiles = searchFiles(searchQuery);
        if (!Number.isNaN(searchCountQuery)) {
          displayFiles(filteredFiles.slice(0, searchCountQuery));
        } else {
          displayFiles(filteredFiles.slice(0, 10));
        }
      });
    });
  }

  // Initial population of the file list
  function displayFiles(videos_data) {
    videoList.innerHTML = '';
    videos_data.forEach(video_data => {
      const video_item_div = document.createElement('div');
      video_item_div.className = "video-item";
      videoList.appendChild(video_item_div);

      const thumbnails_div = document.createElement('div');
      thumbnails_div.className = "thumbnail-container";
      video_item_div.appendChild(thumbnails_div)

      const href = document.createElement('a')
      href.href = video_data.video_path;
      href.textContent = video_data.name;
      video_item_div.appendChild(href)

      video_data.thumbnails.forEach(thumbnail => {
        const thumbnail_div = document.createElement('div');
        thumbnail_div.className = 'video-thumbnail-wrapper';
        thumbnails_div.appendChild(thumbnail_div);

        const img = document.createElement('img');
        img.className = "video-thumbnail";
        img.src = thumbnail;
        console.log(img.src)
        img.alt = "Thumbnail for " + video_data.name;
        img.loading = "lazy";
        thumbnail_div.appendChild(img);
      });
    });
  }

  // Search functionality
  function searchFiles(query) {
    return videos_data.filter(function(video_data) {
      let matches = false;
      const currFileName = video_data.name.toLowerCase();
      const currSearchQuery = query.toLowerCase();
      try {
          const regex = new RegExp(currSearchQuery, 'i');
          matches = regex.test(currFileName);
      } catch (e) {
          matches = currFileName.includes(currSearchQuery);
      }
      return matches;
    });
  }

  // Event listener for search input
  searchInput.addEventListener('input', (e) => {
    const searchCountQuery = parseInt(searchCount.value);
    const searchQuery = e.target.value;
    const filteredFiles = searchFiles(searchQuery);
    if (!Number.isNaN(searchCountQuery)) {
      displayFiles(filteredFiles.slice(0, searchCountQuery));
    } else {
      displayFiles(filteredFiles.slice(0, 10));
    }
  });

  searchCount.addEventListener('input', (e) => {
    const searchCountQuery = parseInt(e.target.value);
    const searchQuery = searchInput.value;
    const filteredFiles = searchFiles(searchQuery);
    if (!Number.isNaN(searchCountQuery)) {
      displayFiles(filteredFiles.slice(0, searchCountQuery));
    } else {
      displayFiles(filteredFiles.slice(0, 10));
    }
  });

  // Initial display
  displayFiles(videos_data.slice(0, 10));
  displayKeywords(keywords1, keywords2);
  */
}
