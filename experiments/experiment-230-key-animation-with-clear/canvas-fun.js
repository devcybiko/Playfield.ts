const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
window.addEventListener("keydown", handleKeyDown.bind(ctx));

let color = "black";
let x = 0;
let y = 0;

handleKeyDown({});

function handleKeyDown(event) {
    console.log(event);
    if (event.key === 'r') color = 'red';
    if (event.key === 'o') color = 'orange';
    if (event.key === 'y') color = 'yellow';
    if (event.key === 'g') color = 'green';
    if (event.key === 'b') color = 'blue';
    if (event.key === 'i') color = 'indigo';
    if (event.key === 'v') color = 'violet';
    if (event.key === 'ArrowUp') y += -10;
    if (event.key === 'ArrowDown') y += 10;
    if (event.key === 'ArrowLeft') x += -10;
    if (event.key === 'ArrowRight') x += 10;

    this.clearRect(0, 0, canvas.width, canvas.height);
    this.fillStyle = color;
    this.strokeStyle = 'black';
    this.fillRect(x, y, 100, 100);
    this.strokeRect(x, y, 100, 100);
}

