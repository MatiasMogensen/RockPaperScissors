// Initialize scores and round counter
let playerScore = 0;
let computerScore = 0;
let roundsPlayed = 0;
let draw = 0;

// Define the choices
const choices = ['rock', 'paper', 'scissors'];
const choicesExtended = ['rock', 'paper', 'scissors', 'bomb', 'moose'];
const choiceEmojis = {
    rock: '🪨',paper: '📄',scissors: '✂️',bomb: '💣',moose: '🦌', helmet: '🪖'
  };
  
const unlockThreshold = 5; //Number of rounds before unlocking extended choices
let unlocked = false; //Flag to check if extended choices are unlocked
let victory = false; //Flag to check if the game is won
let defeat = false; //Flag to check if the game is lost
var finalRound = false; //Flag to check if the game is in its final round
let lastWinner = ''; //Flag to check the winner of the last round

// Function to get the computer's choice
function getComputerChoice() {
    const isExtended = playerScore >= unlockThreshold; // Check if extended choices are unlocked
    const availableChoices = isExtended ? choicesExtended : choices;
    const randomIndex = Math.floor(Math.random() * availableChoices.length);
    return availableChoices[randomIndex];
}

function helmetOption() {
    const helmet = confirm("You chose moose but the PC chose bomb. Do you want to put on your helmet?");
    if (helmet) {
        console.log('Helmet chosen. Updating emoji.'); // Debug log
        document.getElementById('player-choice').textContent = choiceEmojis['helmet'];
    }
    return helmet;
}


// Function to play a single round
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    if (victory) {
        alert('You have already won the game!Let me reset the game for you.');
        reset()
        return;
    } if (defeat) {
        alert('You have already lost the game!Let me reset the game for you.');
        reset()
        return
    };


    let result = '';

    if (playerChoice === 'moose' && computerChoice === 'bomb') {
        // Offer the "helmet" option if the player chose moose and computer picks bomb
        if (helmetOption()) {
            showChoice(playerChoice, 'player-choice');
            showChoice(computerChoice, 'computer-choice');
            result = "Your moose put on its helmet and survived the bomb! You win!";
            document.getElementById('message').textContent = result;
            roundsPlayed++;
            playerScore++;
            return; // End the round early
        }
    }

    showChoice(playerChoice, 'player-choice');
    showChoice(computerChoice, 'computer-choice');

    if (playerChoice === computerChoice) {
        result = `It's a tie! Both chose ${playerChoice}.`;
        draw++;
        lastWinner = 'draw';
    } else if (
        (playerChoice === 'rock' && (computerChoice === 'scissors' || computerChoice === 'bomb')) ||
        (playerChoice === 'scissors' && (computerChoice === 'paper' || computerChoice === 'bomb')) ||
        (playerChoice === 'paper' && (computerChoice === 'rock' || computerChoice === 'moose')) ||
        (playerChoice === 'bomb' && (computerChoice === 'paper')) ||
        (playerChoice === 'moose' && (computerChoice === 'scissors' || computerChoice === 'rock'))
    ) {
        playerScore++;
        result = `You win! ${playerChoice} beats ${computerChoice}.`;
        lastWinner = 'player';
    } else {
        computerScore++;
        result = `You lose! ${computerChoice} beats ${playerChoice}.`;
        lastWinner = 'computer';
    }

    roundsPlayed++; // New: Increment the round counter
    document.getElementById('message').textContent = result;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('rounds-played').textContent = roundsPlayed;
    document.getElementById('draw').textContent = draw;

    // Check if the extended choices should be unlocked
    if (playerScore === unlockThreshold && unlocked == false) {
        document.getElementById('message').textContent += ' Extended choices unlocked: Bomb and Moose!';
        revealExtendedChoices(); // Call to reveal the new choices
        unlocked = true; // Set the flag to true to prevent re-unlocking
    }
    // Check if the game is won, lost or in its final round
    if (playerScore === 15) {
        document.getElementById('message').textContent = 'You win the game! Congratulations!';
        victory = true;
    }
    if (computerScore === 15) {
        document.getElementById('message').textContent = 'You lose the game! Better luck next time!';
        defeat = true;
    }
}

// Function to handle player choice
function handlePlayerChoice(event) {
    const playerChoice = event.target.id;
    playRound(playerChoice);
}

// Add event listeners to choice buttons
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', handlePlayerChoice);
});

function reset() {
    playerScore = 0;
    computerScore = 0;
    roundsPlayed = 0;
    draw = 0;
    document.getElementById('message').textContent = 'Make your choice!';
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('rounds-played').textContent = roundsPlayed;
    document.getElementById('draw').textContent = draw;
    hideExtendedChoices();
    victory = false;
    defeat = false;
}

// Function to reveal and hide the extended choices
function revealExtendedChoices() {
    document.getElementById('bomb').style.display = 'inline-block';
    document.getElementById('moose').style.display = 'inline-block';
}

function hideExtendedChoices() {
    document.getElementById('bomb').style.display = 'none';
    document.getElementById('moose').style.display = 'none';
}

// Function to animate the player and computer choices
function showChoice(choice, elementId) {
    const element = document.getElementById(elementId);
    // Directly set the emoji if it’s specifically set by helmetOption
    const emoji = (elementId === 'player-choice' && choice === 'moose' && element.textContent === choiceEmojis['helmet'])
        ? choiceEmojis['helmet']
        : choiceEmojis[choice] || '🤔'; // Default emoji if choice is not found  

    element.textContent = emoji;
    element.classList.remove('show');
    element.offsetHeight; // Trigger reflow

    element.classList.add('show');

    document.querySelectorAll('.choice').forEach(button => {
        button.classList.add('no-pointer-events');
    });

    setTimeout(() => {
        element.classList.remove('show');
        document.querySelectorAll('.choice').forEach(button => {
            button.classList.remove('no-pointer-events');
        });
    }, 500); // Match the duration of the CSS animation
}