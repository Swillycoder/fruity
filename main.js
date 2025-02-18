const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 550;
canvas.height = 600;

const images = {
    machine: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/fruity.png',
    cherries: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/http://localhost:8000/images/cherries50px.png',
    apples: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/apple50px.png',
    bananas: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/banana50px.png',
    watermelon: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/watermelon50px.png',
    grapes: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/grapes50px.png',
    blue7: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/7blue.png',
    red7: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/7red.png',
    yellow7: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/7yellow.png',
    bar_bg: 'https://raw.githubusercontent.com/Swillycoder/fruity/main/bar4.png',
};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
};

async function loadAllImages(imageSources) {
    const loadedImages = {};
    for (const [key, src] of Object.entries(imageSources)) {
        try {
            loadedImages[key] = await loadImage(src);
            console.log(`${key} loaded successfully`);
        } catch (error) {
            console.error(error);
        }
    }
    return loadedImages;
}

class Reels {
    constructor(xR1, xR2, xR3, y) {
        this.xR1 = xR1;
        this.xR2 = xR2;
        this.xR3 = xR3;
        this.y = y;
        this.held = [false, false, false];
        this.pot = 1;
        this.canHold = false;
        
        this.colorReel1 = [loadedImages.cherries, loadedImages.apples, loadedImages.bananas, loadedImages.watermelon, loadedImages.grapes, loadedImages.blue7, loadedImages.red7, loadedImages.yellow7];
        this.colorReel2 = [loadedImages.cherries, loadedImages.apples, loadedImages.bananas, loadedImages.watermelon, loadedImages.grapes, loadedImages.blue7, loadedImages.red7, loadedImages.yellow7];
        this.colorReel3 = [loadedImages.cherries, loadedImages.apples, loadedImages.bananas, loadedImages.watermelon, loadedImages.grapes, loadedImages.blue7, loadedImages.red7, loadedImages.yellow7];

        // Set initial random colors
        this.currentColor1 = this.getRandomColor(this.colorReel1);
        this.currentColor2 = this.getRandomColor(this.colorReel2);
        this.currentColor3 = this.getRandomColor(this.colorReel3);

         // Holds state for each reel
    }

    getRandomColor(colorArray) {
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }


    spin() {
        if (plays >= 1)
            this.canHold = Math.random() < 0.5;

            if (!this.held[0]) this.currentColor1 = this.getRandomColor(this.colorReel1);
            if (!this.held[1]) this.currentColor2 = this.getRandomColor(this.colorReel2);
            if (!this.held[2]) this.currentColor3 = this.getRandomColor(this.colorReel3);

           
            if (!this.canHold) {
                this.held = [false, false, false];
            }
            
            this.checkWin();
    }

    toggleHold(index) {
        if (this.canHold) { // Only allow hold if the probability allows it
            this.held[index] = !this.held[index];
        }
    }

    checkWin() {
        if (this.currentColor1 === this.currentColor2 && 
            this.currentColor2 === this.currentColor3 && 
            this.currentColor1 === this.currentColor3) {
            let winningAmount = this.colorReel1.indexOf(this.currentColor1) + 1;
            this.pot += winningAmount;

            this.winMessage = "WIN!";
            // Clear message after 2 seconds
            if (this.winMessageTimeout) clearTimeout(this.winMessageTimeout);
            this.winMessageTimeout = setTimeout(() => this.winMessage = null, 2000);
        }
    }

    draw() {
        // Draw Reel 1
        ctx.drawImage(this.currentColor1, this.xR1, this.y)
        // Draw HOLD message if held
        if (this.held[0]) {
            ctx.textAlign = 'left'
            ctx.fillStyle = 'red';
            ctx.font = '20px Impact';
            ctx.fillText("HOLD", this.xR1 + 5, this.y + 70);
        }
        // Draw Reel 2
        ctx.drawImage(this.currentColor2, this.xR2, this.y)
        if (this.held[1]) {
            ctx.textAlign = 'left'
            ctx.fillStyle = 'red';
            ctx.font = '20px Impact';
            ctx.fillText("HOLD", this.xR2 + 5, this.y + 70);
        }
        // Draw Reel 3
        ctx.drawImage(this.currentColor3, this.xR3, this.y)
        if (this.held[2]) {
            ctx.textAlign = 'left'
            ctx.fillStyle = 'red';
            ctx.font = '20px Impact';
            ctx.fillText("HOLD", this.xR3 + 5, this.y + 70);
        }
        ctx.textAlign = 'left'
        ctx.fillStyle = 'red';
        ctx.font = '20px Impact';
        ctx.fillText("$" + this.pot.toFixed(2), 415, 222);

        if (this.winMessage) {
            ctx.textAlign = 'left'
            ctx.fillStyle = 'red';
            ctx.font = '25px Impact';
            ctx.fillText(this.winMessage, 80, 175);
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 12, 152, 5, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(canvas.width/2 + 13, 152, 5, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        if (this.canHold) {
            holdButton1.visible = true;
            holdButton2.visible = true;
            holdButton3.visible = true;
            ctx.textAlign = 'left'
            ctx.fillStyle = 'red';
            ctx.font = '25px Impact';
            ctx.fillText('HOLD ACTIVE', 170, 310);
        }
    
        if (!this.canHold) {
            holdButton1.visible = false;
            holdButton2.visible = false;
            holdButton3.visible = false;
        }
        
        if (this.currentColor1 === this.currentColor2 && 
            this.currentColor2 === this.currentColor3 && 
            this.currentColor1 === this.currentColor3) {
            let winningAmount = this.colorReel1.indexOf(this.currentColor1) + 1;
            ctx.strokeStyle = 'blue';  // Set the stroke color to blue
            ctx.lineWidth = 3;         // Set the stroke width to 3px
            ctx.strokeRect(410, 505 - 23.5 * winningAmount, 74, 22);  
        }

        if (this.pot > 0) {
            collectButton.visible = true;
        }
        if (walletAmount >= 1) {
            insertButton.visible = true;
        } else insertButton.visible = false;
        
        if (plays <= 0) {
            playButton.visible = false;
        } else playButton.visible = true;
    }
}

const keys = {
    KeyM: false,
    KeyB: false,
    Enter: false,
    Space: false,
    ArrowUp: false,
    ArrowDown: false,
    KeyW: false,
    KeyI: false,
};

let gameState = "machineScreen";
let loadedImages;
let fruityReels;
let walletAmount = 20;
let plays = 0;

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

const holdButton1 = {x: 133, y: 520, width: 40, height: 24, radius: 7, visible: false, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};
const holdButton2 = {x: 210, y: 520, width: 40, height: 24, radius: 7, visible: false, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};
const holdButton3 = {x: 282, y: 520, width: 40, height: 24, radius: 7, visible: false, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};

const collectButton = {x: 50, y: 520, width: 40, height: 24, radius: 7, visible: false, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(254, 254, 47, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};

const insertButton = {x: 415, y: 25, width: 87, height: 19, radius: 7, visible: false, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(254, 254, 47, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};

const playButton = {x: 445, y: 520, width: 40, height: 24, radius: 7, visible: true, 
    draw() {
        if (this.visible) { // Only draw if visible is true
            ctx.fillStyle = 'rgba(0, 243, 8, 0.5)';
            drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.radius);
        }
    }
};

function gameLoop() {
    if (gameState === "barScreen") {
        barScreen();
    } else if (gameState === "machineScreen") {
        machineScreen();
    }
    requestAnimationFrame(gameLoop);
}
    

function barScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedImages.bar_bg, 0, 0)
}

function machineScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(loadedImages.machine, canvas.width/2 - 255,0)
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"
    ctx.font = '30px Impact';
    ctx.fillText("$" + walletAmount.toFixed(2), 85, 85);
    ctx.textAlign = 'center'
    ctx.fillStyle = 'red';
    ctx.font = '25px Impact';
    ctx.fillText(plays, 448, 174);
    fruityReels.draw();
    holdButton1.draw();
    holdButton2.draw();
    holdButton3.draw();
    collectButton.draw();
    insertButton.draw();
    playButton.draw();
}

(async () => {
    console.log("Loading images...");
    loadedImages = await loadAllImages(images);
    console.log("All images loaded!");

    fruityReels = new Reels(121, 207, 291, 350)
    // Start the game loop after images are loaded
    gameLoop();
})();

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }

    if (gameState === "machineScreen") {
        if (e.code === 'Space') {
            if (plays >= 1){
                plays -= 1
                fruityReels.spin();
                machineScreen();
            } else return// Redraw with new colors

        }
        if (e.code === 'KeyW') {
            walletAmount += fruityReels.pot ;
            fruityReels.pot = 0
        }
        if (e.code === 'KeyI') {
            if (walletAmount >= 1) {
                walletAmount -= 1
                plays += 4
            }
        }
        if (e.code === 'Digit1') {
            fruityReels.toggleHold(0);
            machineScreen();
        }
        if (e.code === 'Digit2') {
            fruityReels.toggleHold(1);
            machineScreen();
        }
        if (e.code === 'Digit3') {
            fruityReels.toggleHold(2);
            machineScreen();
        }
    }

    if (e.code === 'KeyM') {
        gameState = "machineScreen";
    }
    if (e.code === 'KeyB') {
        gameState = "barScreen";
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    mouseClicked = true;
    
    if (mouseX >= collectButton.x && mouseX <= collectButton.x + collectButton.width &&
        mouseY >= collectButton.y && mouseY <= collectButton.y + collectButton.height){
        walletAmount += fruityReels.pot;
        fruityReels.pot = 0; 
        collectButton.visible = false
    } 

    if (mouseX >= insertButton.x && mouseX <= insertButton.x + insertButton.width &&
        mouseY >= insertButton.y && mouseY <= insertButton.y + insertButton.height){
        walletAmount -= 1;
        plays += 4;
        if (walletAmount <= 0) {
            walletAmount = 0;
            plays -= 4;
        }
    } 

    if (mouseX >= playButton.x && mouseX <= playButton.x + playButton.width &&
        mouseY >= playButton.y && mouseY <= playButton.y  +playButton.height){
            if (gameState === "machineScreen") {
                if (plays >= 1){
                    plays -= 1
                    fruityReels.spin();
                    machineScreen();
                } else return// Redraw with new colors
                
            }
        }
    
     

    if (fruityReels.canHold) {
        if (mouseX >= holdButton1.x && mouseX <= holdButton1.x + holdButton1.width &&
            mouseY >= holdButton1.y && mouseY <= holdButton1.y + holdButton1.height) {
                fruityReels.held[0] = !fruityReels.held[0];
        }
        if (mouseX >= holdButton2.x && mouseX <= holdButton2.x + holdButton2.width &&
            mouseY >= holdButton2.y && mouseY <= holdButton2.y + holdButton2.height) {
                fruityReels.held[1] = !fruityReels.held[1];
        }
        if (mouseX >= holdButton3.x && mouseX <= holdButton3.x + holdButton3.width &&
            mouseY >= holdButton3.y && mouseY <= holdButton3.y + holdButton3.height) {
                fruityReels.held[2] = !fruityReels.held[2];
        }
    }
});
