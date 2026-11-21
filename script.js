// PLAYER VARIABLES

let health = 100;
let ammo = 12;
let medkits = 2;

let inventory = [];

let zombieAlive = true;
let bossAlive = true;
let gameEnded = false;

const choices = document.getElementById("choices");


// UPDATE PLAYER STATUS

function updateStatus() {

    document.getElementById("health").textContent = health;
    document.getElementById("ammo").textContent = ammo;
    document.getElementById("medkits").textContent = medkits;

    document.getElementById("items").textContent =
        inventory.length > 0
        ? inventory.join(", ")
        : "Empty";
}


// DISPLAY STORY AND BUTTONS

function showScene(location, title, text, options) {

    document.getElementById("location").textContent =
        "LOCATION: " + location;

    document.getElementById("scene-title").textContent = title;

    document.getElementById("story-text").textContent = text;

    choices.innerHTML = "";

    options.forEach(option => {

        const button = document.createElement("button");

        button.textContent = option.text;

        button.onclick = function() {
            makeChoice(option.action);
        };

        choices.appendChild(button);

    });

    updateStatus();
}


// CHECK PLAYER HEALTH

function checkHealth() {

    if (health <= 0) {

        health = 0;
        gameEnded = true;

        showScene(
            "UNKNOWN",
            "GAME OVER",
            "Your health has reached zero. The infected creatures have overwhelmed you. The Dead Zone claims another victim.",
            [
                {text: "TRY AGAIN", action: "restart"}
            ]
        );

        return true;
    }

    return false;
}


// MAIN GAME SYSTEM

function makeChoice(action) {

    if (gameEnded) return;


    // EXPLORE LABORATORY

    if (action === "explore") {

        showScene(
            "RESEARCH LAB",
            "THE ABANDONED LABORATORY",
            "You walk through the laboratory. Broken equipment and blood stains cover the floor. You discover a handgun ammunition box.",
            [
                {text: "Collect ammunition", action: "collectAmmo"},
                {text: "Enter the hallway", action: "hallway"}
            ]
        );

    }


    // COLLECT AMMUNITION

    else if (action === "collectAmmo") {

        ammo += 6;

        showScene(
            "RESEARCH LAB",
            "AMMUNITION FOUND",
            "You collect six additional bullets. A loud noise suddenly comes from the hallway.",
            [
                {text: "Investigate the noise", action: "hallway"},
                {text: "Return to the starting room", action: "start"}
            ]
        );

    }


    // HALLWAY

    else if (action === "hallway") {

        if (zombieAlive) {

            showScene(
                "MAIN HALLWAY",
                "INFECTED DETECTED!",
                "A zombie suddenly appears from the darkness. It starts walking toward you. Prepare to defend yourself!",
                [
                    {text: "SHOOT THE ZOMBIE", action: "shoot"},
                    {text: "RUN AWAY", action: "run"}
                ]
            );

        } else {

            showScene(
                "MAIN HALLWAY",
                "CLEAR",
                "The hallway is now clear. You notice a security room nearby.",
                [
                    {text: "Enter security room", action: "security"},
                    {text: "Return to laboratory", action: "explore"}
                ]
            );

        }

    }


    // SHOOT ZOMBIE

    else if (action === "shoot") {

        if (ammo > 0) {

            ammo--;

            zombieAlive = false;

            showScene(
                "MAIN HALLWAY",
                "ZOMBIE ELIMINATED",
                "You fire your handgun. The zombie falls to the ground. You notice a security keycard beside its body.",
                [
                    {text: "Collect the keycard", action: "keycard"},
                    {text: "Enter security room", action: "security"}
                ]
            );

        } else {

            showScene(
                "MAIN HALLWAY",
                "OUT OF AMMUNITION",
                "Your handgun is empty! You cannot shoot the zombie.",
                [
                    {text: "Run away", action: "run"},
                    {text: "Try to reload", action: "reload"}
                ]
            );

        }

    }


    // RUN AWAY

    else if (action === "run") {

        health -= 20;

        if (checkHealth()) return;

        showScene(
            "RESEARCH LAB",
            "ESCAPED!",
            "You manage to escape, but the zombie attacks your arm before you get away. You lose 20 health.",
            [
                {text: "Return to hallway", action: "hallway"},
                {text: "Use a medkit", action: "heal"}
            ]
        );

    }


    // RELOAD

    else if (action === "reload") {

        ammo += 6;
showScene(
            "MAIN HALLWAY",
            "WEAPON RELOADED",
            "You reload your handgun using your spare ammunition.",
            [
                {text: "Fight the zombie", action: "shoot"},
                {text: "Run away", action: "run"}
            ]
        );

    }


    // COLLECT KEYCARD

    else if (action === "keycard") {

        if (!inventory.includes("Security Keycard")) {
            inventory.push("Security Keycard");
        }

        showScene(
            "MAIN HALLWAY",
            "ITEM ACQUIRED",
            "You collect the security keycard. It may unlock the restricted area.",
            [
                {text: "Enter security room", action: "security"},
                {text: "Return to laboratory", action: "explore"}
            ]
        );

    }


    // SECURITY ROOM

    else if (action === "security") {

        if (inventory.includes("Security Keycard")) {

            showScene(
                "SECURITY ROOM",
                "ACCESS GRANTED",
                "You use the keycard to unlock the security room. A computer displays a message: 'PROJECT DEAD ZONE - SUBJECT 001 IS STILL ALIVE.'",
                [
                    {text: "Read the computer files", action: "computer"},
                    {text: "Enter underground facility", action: "underground"}
                ]
            );

        } else {

            showScene(
                "SECURITY ROOM",
                "ACCESS DENIED",
                "The security door requires an access card.",
                [
                    {text: "Return to hallway", action: "hallway"}
                ]
            );

        }

    }


    // COMPUTER FILES

    else if (action === "computer") {

        inventory.push("Research File");

        showScene(
            "SECURITY ROOM",
            "CLASSIFIED INFORMATION",
            "The research file reveals that the virus was created inside this facility. The final experiment is located underground.",
            [
                {text: "Go underground", action: "underground"},
                {text: "Return to hallway", action: "hallway"}
            ]
        );

    }


    // UNDERGROUND FACILITY

    else if (action === "underground") {

        showScene(
            "UNDERGROUND FACILITY",
            "THE FINAL EXPERIMENT",
            "You enter a massive underground laboratory. A giant infected creature breaks out of its containment chamber. It is the source of the outbreak!",
            [
                {text: "Fight the creature", action: "boss"},
                {text: "Try to escape", action: "escape"}
            ]
        );

    }


    // FINAL BOSS

    else if (action === "boss") {

        if (ammo >= 3 && bossAlive) {

            ammo -= 3;
            bossAlive = false;

            showScene(
                "UNDERGROUND FACILITY",
                "FINAL BOSS DEFEATED",
                "You fire three shots at the creature's weak point. It collapses. Behind its containment chamber, you discover an emergency exit.",
                [
                    {text: "Escape the facility", action: "escape"}
                ]
            );

        } else if (!bossAlive) {

            showScene(
                "UNDERGROUND FACILITY",
                "THE CREATURE IS DEAD",
                "The creature is already defeated. The emergency exit is ready.",
                [
                    {text: "Escape the facility", action: "escape"}
                ]
            );

        } else {

            showScene(
                "UNDERGROUND FACILITY",
                "NOT ENOUGH AMMO",
                "You need at least three bullets to defeat the creature. It attacks you!",
                [
                    {text: "Run to the exit", action: "escape"},
                    {text: "Use a medkit", action: "heal"}
                ]
            );

        }

    }


    // HEAL PLAYER

    else if (action === "heal") {

        if (medkits > 0) {

            medkits--;

            health = Math.min(100, health + 40);

            showScene(
                "SAFE ROOM",
                "FIRST AID USED",
                "You use a first aid kit and recover 40 health points.",
                [
                    {text: "Return to hallway", action: "hallway"},
                    {text: "Continue underground", action: "underground"}
                ]
            );

        } else {

            showScene(
                "SAFE ROOM",
                "NO MEDKITS",
                "You have no remaining first aid kits.",
                [
                    {text: "Continue", action: "hallway"}
                ]
            );

        }

    }


    // ESCAPE

    else if (action === "escape") {

        if (bossAlive) {

            health -= 30;

            if (checkHealth()) return;
showScene(
                "EMERGENCY EXIT",
                "ESCAPE ATTEMPT",
                "You try to escape without defeating the creature. It attacks you, but you manage to reach the emergency exit.",
                [
                    {text: "Escape now", action: "ending"}
                ]
            );

        } else {

            showScene(
                "EMERGENCY EXIT",
                "EXIT UNLOCKED",
                "The facility's emergency door opens. You can finally escape!",
                [
                    {text: "Leave the facility", action: "ending"}
                ]
            );

        }

    }


    // GOOD ENDING

    else if (action === "ending") {

        gameEnded = true;

        showScene(
            "OUTSIDE THE FACILITY",
            "GOOD ENDING: SURVIVOR",
            "You escape the research facility just before it explodes. The city is still infected, but you are alive. Your radio suddenly receives a transmission: 'This is only the beginning.'",
            [
                {text: "PLAY AGAIN", action: "restart"}
            ]
        );

    }


    // RESTART

    else if (action === "restart") {

        restartGame();

    }

    updateStatus();

}


// START / RESTART GAME

function restartGame() {

    health = 100;
    ammo = 12;
    medkits = 2;

    inventory = [];

    zombieAlive = true;
    bossAlive = true;
    gameEnded = false;

    showScene(
        "RESEARCH LAB",
        "THE OUTBREAK",
        "The city has fallen. A mysterious virus has infected its citizens. You wake up inside an abandoned research facility. Your radio suddenly turns on: 'Survivor detected. Find the security keycard. Get out before it's too late.'",
        [
            {text: "Explore the laboratory", action: "explore"},
            {text: "Enter the hallway", action: "hallway"},
            {text: "Check your equipment", action: "heal"}
        ]
    );

}

restartGame();
