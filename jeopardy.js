// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let clues = [];
const NUM_CATEGORIES = 6
const NUM_QUESTIONS_PER_CAT = 5
const $loadingMsg = $("#loading-msg");



/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

//We need to sample 6 random items from res:

const getIdx = ()=>{
        return Math.floor(Math.random()*100); //gets random index # 0-100.
}

async function getCategoryIds() {
    categories = [];
    let arr = [];
    let noDupes = []
    const res = await axios.get('https://jservice.io/api/categories', {params: {count: 100}});
    for(let i = 0; i<NUM_CATEGORIES; i++){
      let idx = getIdx();
        if (noDupes.includes(res.data[idx].id) || (res.data[idx].clues_count < 5)){  //checks to see if the ID exists in array of noDupes, if already exists, increment i--.
            i--;
        } else {
            arr.push({id: res.data[idx].id, title: res.data[idx].title}); //pushes non-duplicate ID value to array
            noDupes.push(res.data[idx].id);
        }
    }
    categories.push(arr);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(id) {
    let clueArray = []
    const res = await axios.get('https://jservice.io/api/category', {params: {id}});
    for(let i = 0; i< res.data.clues.length; i++){
        clueArray.push({title: res.data.title, clues: [{question: res.data.clues[i].question, answer: res.data.clues[i].answer, showing: null}]});
    }
    clues.push(clueArray);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

let multiplier = 1;
const createTr = ()=>{
    const row = document.createElement('tr');
    return row;
}
const createHdr = ()=>{
    const trhead = document.createElement('thead')
    const tr = document.createElement('tr')
    for (let i=0;i<NUM_CATEGORIES;i++){
        let td = document.createElement('td')
        td.setAttribute('id', `h${i}`);
        td.classList.add('td-header');
        let id = categories[0][i].title;
        td.innerText = id;
        tr.appendChild(td);
    }
    trhead.append(tr);
    return trhead;
} 
const createTd = (row, idx)=>{
        const td = document.createElement('td')
        td.setAttribute('id', `${row}-${idx}`);
        td.classList.add('td');
        td.innerText = "$"+ (200 * multiplier) +".00";
        return td;
}
const createResetBtn = () => {
    const btn = document.createElement('button');
    btn.setAttribute('id', 'reset');
    btn.classList.add('button');
    btn.innerText = "Reset Game";
    let top = document.querySelector('.top');
    top.append(btn);
}


async function fillTable() {
    await getCategoryIds();
    for(let i = 0; i < NUM_CATEGORIES; i++){
       await getCategory(categories[0][i].id)
}
    $loadingMsg.hide();
    const table = document.createElement('table')
    table.append(createHdr());
    table.classList.add('jeopardyTable')
    document.body.append(table);
    for(let i = 0; i< NUM_QUESTIONS_PER_CAT; i++){
        let row = (createTr());
        let rowCnt = i;
        for(let i = 0; i<NUM_CATEGORIES; i++){
            row.appendChild(createTd(rowCnt, i));
        }
         table.append(row);
         multiplier++;
    }
    
}

function clearTable(){
    let allRows = document.querySelectorAll('tr');
    let table = document.querySelector('table');
    table.remove(allRows);
}





/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
const page = document.body;
page.addEventListener('click', handleClick);

function handleClick(evt) {
    if (evt.target.classList.value === 'td' && evt.target.classList !== "question"){
        let colIdx = (evt.target.id[2]);
        let rowIdx = (evt.target.id[0]);
        let clue = clues[colIdx][rowIdx].clues[0].question;
        evt.target.innerText = clue;
        evt.target.style.fontSize = "14px";
        evt.target.classList.add("question"); 
    } else if (evt.target.classList !== "answered"){
        let colIdx = (evt.target.id[2]);
        let rowIdx = (evt.target.id[0]);
        let clue = clues[colIdx][rowIdx].clues[0].answer;
        evt.target.innerText = clue;
        evt.target.style.fontSize = "14px";
        evt.target.classList.add("answered"); 
    }
}

const topClick = document.querySelector('.top');
top.addEventListener("click", (e) => {
if (e.target.classList.value === 'button'){
    $loadingMsg.show();
    categories = [];
    clues = [];
    multiplier = 1;
    clearTable();
    fillTable();
};
}
)


fillTable();
createResetBtn();
