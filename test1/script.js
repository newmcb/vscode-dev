function debounce(fn, wait) {
let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), wait); };
}


const input = document.getElementById('q');
const clearBtn = document.getElementById('clear');
const table = document.getElementById('people');
const rows = Array.from(table.tBodies[0].rows);
const countEl = document.getElementById('count');
const statusEl = document.getElementById('status');


function normalize(s) { return s.toLowerCase(); }
function clearMarks(cell) { cell.innerHTML = cell.textContent; }
function highlight(cell, q) {
if (!q) return;
const text = cell.textContent;
const idx = text.toLowerCase().indexOf(q);
if (idx === -1) return;
const before = text.slice(0, idx);
const match = text.slice(idx, idx + q.length);
const after = text.slice(idx + q.length);
cell.innerHTML = `${before}<mark>${match}</mark>${after}`;
}


function filter(qRaw) {
const q = normalize(qRaw.trim());
let visible = 0;
rows.forEach(tr => {
const cells = Array.from(tr.cells);
cells.forEach(clearMarks);
const hay = normalize(cells.map(td => td.textContent).join(' '));
const hit = q === '' || hay.includes(q);
tr.classList.toggle('hidden', !hit);
if (hit) {
visible++;
if (q) cells.forEach(td => highlight(td, q));
}
});
countEl.textContent = visible;
statusEl.textContent = q ? `"${qRaw}" 검색 결과: ${visible}건` : `검색어 없음: 전체 ${rows.length}건`;
}


const filterDebounced = debounce(filter, 120);
input.addEventListener('input', e => filterDebounced(e.target.value));
clearBtn.addEventListener('click', () => { input.value = ''; filter(''); input.focus(); });
filter('');