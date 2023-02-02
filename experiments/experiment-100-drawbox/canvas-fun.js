const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(30, 30, 100, 100);

ctx.strokeStyle = 'black';
ctx.strokeRect(0,0,canvas.width-1,canvas.height-1)