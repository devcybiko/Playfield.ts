const canvas = document.querySelector('#my_canvas');
const ctx = canvas.getContext('2d');
for(let i=0; i<250; i+=10) {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.fillRect(i, i, 100, 100);
    ctx.strokeRect(i, i, 100, 100);
}
