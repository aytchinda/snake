var canvas, gameContainer, scoreContainer, ctx;
var score = 10;
// Propriétés du canvas
const canvasSize = 350;
const canvasBorder = "3px solid red";
const canvasBackgroundColor = "black";
const canvasOpacity = 0.8;

// Propriétés du score
const scoreColor = "white";

// Propriétés du snack
const snackColor = "orange";
const snackSize = 15;
var snackX = Math.trunc(Math.random() * (canvasSize - snackSize));
var snackY = Math.trunc(Math.random() * (canvasSize - snackSize));

// Propriétés de la nourriture
var rayonFood = snackSize / 3;
var foodX = Math.trunc(Math.random() * (canvasSize - snackSize) + rayonFood);
var foodY = Math.trunc(Math.random() * (canvasSize - snackSize) + rayonFood);

// Propriétés de déplacement
var stepX = 0;
var stepY = 0;

// Charger les fichiers audio
const loseSound = new Audio('../assets/media/lose.mp3');
const winSound = new Audio('../assets/media/win.');

export const SnackGame = {
    gameOver: false,// Ajout d'une variable pour suivre l'état du jeu

    start: () => {
        SnackGame.createCanvas();
        SnackGame.createSnack();
        SnackGame.initMoveSnack();
        setInterval(SnackGame.updateSnackPosition, 250);
    },

    createCanvas: () => {
        console.log("createCanvas");

        // créer le canvas
        gameContainer = document.createElement("div");
        scoreContainer = document.createElement("div");
        scoreContainer.id = "score";
        scoreContainer.innerHTML = new Intl.NumberFormat("fr-FR",
            { style: "currency", currency: "USD" }).format(score);

        scoreContainer.style.color = scoreColor;
        scoreContainer.style.fontSize = 30 + "px";
        scoreContainer.style.zIndex = "10";
        scoreContainer.style.position = "fixed";

        gameContainer.id = "gameContainer";
        canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.border = canvasBorder;
        canvas.style.backgroundColor = canvasBackgroundColor;
        canvas.style.opacity = canvasOpacity;
        gameContainer.style.display = "flex";
        gameContainer.style.justifyContent = "center";
        gameContainer.style.alignItems = "center";

        ctx = canvas.getContext("2d");

        console.log(canvas);

        gameContainer.appendChild(scoreContainer);
        gameContainer.appendChild(canvas);
        document.body.appendChild(gameContainer);
    },

    createSnack: () => {
        ctx.fillStyle = snackColor;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.fillRect(snackX, snackY, snackSize, snackSize);
        SnackGame.createFood();
    },

    createFood: () => {
        ctx.beginPath();
        ctx.arc(foodX, foodY, rayonFood, 0, 2 * Math.PI);
        ctx.fillStyle = snackColor;
        ctx.fill();
        ctx.closePath();
    },

    updateSnackPosition: () => {

        if (SnackGame.gameOver) return; // Vérifier si le jeu est terminé
        
        snackX += stepX * snackSize;
        snackY += stepY * snackSize;

        // Détection de collision avec les bords du canvas
        let hitBorder = false;
        if (snackX < 0) {
            snackX = 0;
            hitBorder = true;
        }
        if (snackX + snackSize > canvasSize) {
            snackX = canvasSize - snackSize;
            hitBorder = true;
        }
        if (snackY < 0) {
            snackY = 0;
            hitBorder = true;
        }
        if (snackY + snackSize > canvasSize) {
            snackY = canvasSize - snackSize;
            hitBorder = true;
        }

        // Jouer le son de collision avec les bords
        if (hitBorder) {
            SnackGame.gameOver = true;
        loseSound.play();
        // Affichage du texte "Game Over"
        ctx.font = "50px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasSize / 2, canvasSize / 2);
        return; // Arrêter l'exécution de la fonction
        }

        // Détection de collision avec la nourriture
        if (Math.abs(snackX + snackSize / 2 - foodX) < rayonFood + snackSize / 2 &&
            Math.abs(snackY + snackSize / 2 - foodY) < rayonFood + snackSize / 2) {
            score += 10;
            scoreContainer.innerHTML = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(score);
            foodX = Math.trunc(Math.random() * (canvasSize - snackSize) + rayonFood);
            foodY = Math.trunc(Math.random() * (canvasSize - snackSize) + rayonFood);
            
            // Jouer le son de collision avec la nourriture
            winSound.play();
        }

        SnackGame.createSnack();
    },

    initMoveSnack: () => {
        document.addEventListener("keydown", (event) => {
            console.log(event.key);

            switch (event.key) {
                case "ArrowUp":
                    stepY = -1;
                    stepX = 0;
                    event.preventDefault();
                    break;

                case "ArrowDown":
                    stepY = 1;
                    stepX = 0;
                    event.preventDefault();
                    break;

                case "ArrowLeft":
                    stepX = -1;
                    stepY = 0;
                    break;

                case "ArrowRight":
                    stepX = 1;
                    stepY = 0;
                    break;

                case "p":
                    stepX = 0;
                    stepY = 0;
                    break;
            }
        })
    }
}
