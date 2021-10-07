const view =
{
    /**
     * Variable used to access the body of the html
     *
     * @member body
     */
    body: document.querySelector("body"),

    /**
     * Variables used to access the board element of the html
     *
     * @member boards
     */
    boards: document.querySelectorAll(".board"),

    /**
     * Array used for the Letters on the board
     *
     * @member locationString
     * @type {array}
     */
    locationString: ['A','B','C','D','E','F','G','H','I','J'],

    /**
     * Variable used to detect that orient has been selected
     *
     * @member orientSelected
     * @type {number}
     */
    orientSelected: 0,

    /**
     * Variable used to store the user orientation
     *
     * @member userOrientSelected
     * @type {number}
     */
    userOrientSelected: -1,

    /**
     * Array used to store the hits in order to see if the ship is sunk
     *
     * @member sunkArr
     * @type {array}
     */
    sunkArr: [],

    /**
     * Count to keep track of how many hits are on a particular ship
     *
     * @member sunkCount
     * @type {number}
     */
    sunkCount: 0,

    /**
     * tag to lable whose turn it is
     *
     * @member gamePhasePlayerTag
     */
    gamePhasePlayerTag: document.createElement("h5"),

    /**
     * Array to store the orientations
     *
     * @member orientArr
     * @type {array}
     */
    orientArr: ['N', 'E', 'S', 'W'],


    /**
     * This function is used to start the renderBoard function.
     *
     * @function runGame
     * @pre None
     * @post renderBoard function is ran
     */
    runGame: function()
    {
        view.renderBoard()
    },



    /**
     * This function is to display the Battleship game board
     *
     * @function renderBoard
     * @pre None
     * @post Board and number and letter on the board are displayed on the screen
     */
    renderBoard: function()
    {
        //temporary variables to store the containers for the letter and numbers
        let container = document.querySelectorAll(".letterContainer")
        let numContainer = document.querySelectorAll(".numberContainer")

        //Creates each spot on the board
        for (let i=0; i<90; i++)
        {
            let temp = document.createElement("img")
            let temp2 = document.createElement("img")
            temp.setAttribute('src', 'images/blank2.png')
            temp.setAttribute('id',i)
            temp.setAttribute('data-id', i)
            temp.onclick = view.boxClickEvent
            temp2.setAttribute('src', 'images/blank2.png')
            temp2.setAttribute('id',100+i)
            temp2.setAttribute('data-id', 100+i)
            temp2.onclick = view.boxClickEvent
            temp.addEventListener('click', view.boxClickEvent)
            temp2.addEventListener('click', view.boxClickEvent)
            view.boards[0].appendChild(temp)
            view.boards[1].appendChild(temp2)
        }
        //displays the letter on the top of the board
        for (let i=0; i<10; i++)
        {
            let temp = document.createElement("div")
            let temp2 = document.createElement("div")
            temp.innerText = this.locationString[i]
            temp2.innerText = this.locationString[i]
            container[0].appendChild(temp)
            container[1].appendChild(temp2)
        }
        //displays the numbers on the columns
        for(let i =0; i<9; i++)
        {
            let temp = document.createElement("div")
            let temp2 = document.createElement("div")
            temp.innerText = i
            temp2.innerText = i
            numContainer[0].appendChild(temp)
            numContainer[1].appendChild(temp2)
        }
        model.setupPhase()
    },

    /**
     * When the box is clicked it will change into a boat picture or display a target
     *
     * @function boxClickEvent
     * @pre Box is clicked on the board
     * @post depending on what state the game is it will either display a boat picture or display a target
     */
    boxClickEvent: function()
    {
        //If its in the setup phase
        if(model.gameState == 1)
        {
            if(this.getAttribute('data-id') < 100)
            {
                if(model.boxClicked == -1)
                {
                    view.displayOrientation()
                }
                let temp = this.getAttribute('data-id')
                model.boxClicked = parseInt(temp)
                view.clearLeftBoard()
                view.displayShips()
                view.boards[0].querySelector(`[data-id = "${model.boxClicked}"]`).setAttribute('src', 'images/boat.png')
            }
            else
            {
                alert("Hey click on the correct board please")
            }
        }
        //If it is in the game phase
        else if(model.gameState == 2)
        {
            if(model.firstGamePhase != 0)
            {
                console.log("here")
                if(this.getAttribute('data-id') > 99)
                {
                    let temp = this.getAttribute('data-id')
                    model.boxClickedRight = parseInt(temp)
                    view.clearRightBoard()
                    view.boards[1].querySelector(`[data-id = "${model.boxClickedRight}"]`).setAttribute('src', 'images/target.png')
                    if(model.error == 0)
                    {
                        model.changeTurn()
                    }
                    view.displayHits()
                    view.displaySunk()
                    view.displayMisses()
                    if(model.error == 0)
                    {
                        model.changeTurn()
                    }
                }
                else
                {
                    alert("Hey click on the correct board please")
                }
            }
            else
            {
                alert("Please hand the computer over to the player and hit next turn when ready")
            }
        }
    },

    /**
     * Used to clear the left board
     *
     * @function clearLeftBoard
     * @pre None
     * @post Clears the left board
     */
    clearLeftBoard: function()
    {
        let temp = view.boards[0].querySelectorAll("img")
        for (let i = 0; i<temp.length; i++)
        {
            temp[i].setAttribute('src','images/blank2.png')
        }
    },

    /**
     * Used to clear the right board
     *
     * @function clearRightBoard
     * @pre None
     * @post Clears the right board
     */
    clearRightBoard: function ()
    {
        let temp = view.boards[1].querySelectorAll("img")
        for(let i = 0; i<temp.length; i++)
        {
            temp[i].setAttribute('src', 'images/blank2.png')
        }
    },

    /**
     * Handles the orientation of the ship
     *
     * @function displayOrientation
     * @pre once a box get clicked the orientation will be displayed
     * @post Displays the orientation text and contains the click event for the orientation
     */
    displayOrientation: function()
    {
        //If you are placing the 1 length ship it has a different prompt
        if(model.placementCounter == 1)
        {
            let temp = document.createElement("div")
            let temp2 = document.createElement("h2")
            temp.innerText = "If you are satisfied with the location, click submit to continue."
            temp2.innerText = "ORIENTATION"
            view.orientSelected = 1
            document.querySelector(".orientContainer").appendChild(temp)

            //If it is player one then it will display the Orientation Title
            if(model.player == 0)
            {
                view.body.appendChild(temp2)
            }
        }
        //If you are placing any other ship than the 1 lengths ship then it will display the north, east, south, west options
        else
        {
            for(let i=0 ; i<4; i++)
            {
                let temp = document.createElement("div")
                temp.innerText = view.orientArr[i]
                temp.setAttribute('data-orientation', i)
                temp.setAttribute('class', view.orientArr[i])
                temp.addEventListener('click', view.userOrientation)
                document.querySelector(".orientContainer").appendChild(temp)
            }
        }
    },

    /**
     * This function is what stores the user's orientation choice
     *
     * @function userOrientation
     * @pre user clicks on the box for the orientation they want
     * @post Function that is used to store the orientation that the user selects
     */
    userOrientation: function()
    {
        view.orientSelected = 1
        if(this.getAttribute('data-orientation') == "0")
        {
            view.userOrientSelected = 0
        }
        else if(this.getAttribute('data-orientation') == "1")
        {
            view.userOrientSelected = 1
        }
        else if(this.getAttribute('data-orientation') == "2")
        {
            view.userOrientSelected = 2
        }
        else if(this.getAttribute('data-orientation') == "3")
        {
            view.userOrientSelected = 3
        }
    },

    /**
     * This function is in charge of clearing the orientation display
     *
     * @function clearOrientation
     * @pre None
     * @post clears the north, south, east, west, options
     */
    clearOrientation: function()
    {
        let temp = document.querySelector(".orientContainer")
        temp = temp.querySelectorAll("div")
        for(let i = 0; i<temp.length; i++)
        {
            temp[i].remove()
        }
    },

    /**
     * This function is used to display the setups
     *
     * @function setupPhaseText
     * @pre the user has clicked the start placing pieces button
     * @post Displays the orientation text and contains the click event for the orientation
     */
    setupPhaseText: function ()
    {
        let playerTag = document.createElement("h5")
        playerTag.innerText = "Player " + (model.player+1) + "'s Turn"
        playerTag.setAttribute('data-player', model.player)

        let instruct = document.createElement("h3")
        instruct.innerText = "Turn away from your opponent, then place pieces by clicking on the spot you want the ship to start in. Next, select your orientation on the right side. Finally, confirm your position/orientation by clicking submit"

        let shipNum = document.createElement("h4")
        shipNum.innerText = "Please place your " + model.placementCounter + " length ship"

        let subButton = document.createElement("button")
        subButton.innerText = "Submit"
        subButton.setAttribute('data-button', 2)


        //Event listener for hitting the submit button
        subButton.addEventListener('click', () =>
        {
            console.log(model.placementCounter)

            //If a box isn't click this block of code will run
            if(model.boxClicked == -1)
            {
                alert("Please select a box to place the ship")
                view.orientSelected = 0
                model.placementCounter -= 1
                view.removeSetupPhaseText()
                model.turnFunc()
            }
            //If statement used for games longer than 1 boat game
            else if(model.promptVar > model.placementCounter && view.orientSelected == 1)
            {
                view.orientSelected = 0
                view.clearOrientation()

                //Checks if the spots where you are placing you ship works and returns true if so
                if(model.updateLocation())
                {
                    model.boxClicked = -1
                    view.displayShips()
                    view.removeSetupPhaseText()
                    model.turnFunc()
                }
                else
                {
                    model.boxClicked = -1
                    model.placementCounter -= 1
                    view.removeSetupPhaseText()
                    model.turnFunc()
                }
            }
            //Case if the orientation isn't selected properly
            else if(view.orientSelected == 1)
            {
                view.orientSelected = 0

                //If the current player is player 1
                if(model.player == 0)
                {
                    if(model.updateLocation())
                    {
                        view.displayShips()
                        view.clearOrientation()
                        model.boxClicked = -1
                        view.removeSetupPhaseText()
                        view.body.appendChild(turnButton)
                    }
                    else
                    {
                        view.clearOrientation()
                        model.boxClicked = -1
                        model.placementCounter -=1
                        view.removeSetupPhaseText()
                        model.turnFunc()
                    }
                }
                else if(model.player != 0 && model.modelprompt == 2) // if it is ai mode
                {
                    if(model.updateLocation())
                    {
                        view.displayShips()
                        view.clearOrientation()
                        model.boxClicked = -1
                        view.removeSetupPhaseText()
                        model.gameState = 2
                        model.gamePhase()
                    }
                    else
                    {
                        view.clearOrientation()
                        model.boxClicked = -1
                        model.placementCounter -=1
                        view.removeSetupPhaseText()
                        model.turnFunc()

                    }
                }
                //If the current player is player 2
                else if(model.modelprompt == 1)
                {
                    if(model.updateLocation())
                    {
                        view.displayShips()
                        view.clearOrientation()
                        model.boxClicked = -1
                        view.removeSetupPhaseText()
                        model.gameState = 2
                        model.gamePhase()
                    }
                    else
                    {
                        view.clearOrientation()
                        model.boxClicked = -1
                        model.placementCounter -=1
                        view.removeSetupPhaseText()
                        model.turnFunc()
                    }
                }
            }
            //For when the set up ends for a particular player
            else
            {
                    alert("Please select an orientation")
                    view.orientSelected = 0
                    model.placementCounter -= 1
                    view.removeSetupPhaseText()
                    model.turnFunc()

            }
            //Deletes the submit button at the end of the setup
            view.body.querySelector(`[data-button = "${2}"]`).remove()
        })


        //Creating a button to indicate when to switch turns
        let turnButton = document.createElement("button")
        turnButton.innerText = "Press here for next turn"
        turnButton.setAttribute('data-button', 1)

        //Adding event lister for the turn button
        turnButton.addEventListener('click', () =>
        {
            model.changeTurn()
            view.clearLeftBoard()
            model.placementCounter = 0
            view.body.querySelector(`[data-button = "${1}"]`).remove()
            model.turnFunc()

            if(model.modelprompt == 2) // it is the AI mode simulate click a ramdom point
            {

                for (let i = 0; i < model.promptVar; i++)
                {
                    do
                    {
                        var num = this.getRandomInt(0,89) //random point
                        var ori = this.getRandomInt(0,3) //random origination
                        view.userOrientSelected = ori
                        view.orientSelected = 1
                        var tempbox = document.getElementById(num)
                        model.boxClicked = num
                    }while (!view.checkplace())
                    tempbox.click()

                    view.body.querySelector(`[data-button = "${2}"]`).click()

                }
                view.body.querySelector(`[data-button = "${3}"]`).click()


            }


        })

        //add the tags to the body of the html file to be displayed
        view.body.appendChild(instruct)
        view.body.appendChild(subButton)
        view.body.appendChild(shipNum)
        view.body.appendChild(playerTag)


    },

    /**
     * This function removes setup phase texts
     *
     * @function removeSetupPhaseText
     * @pre setup is over
     * @post removes all the html elements that are used in the setup phase
     */
    removeSetupPhaseText: function()
    {
        view.body.querySelector("h5").remove()
        view.body.querySelector("h3").remove()
        view.body.querySelector("h4").remove()
    },

    /**
     * This function displays the ships
     *
     * @function displayShips
     * @pre None
     * @post displays the ship based on what player it is
     */
    displayShips: function ()
    {
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].location[j]
                if(temp != null)
                {
                    view.boards[0].querySelector(`[data-id = "${temp}"]`).setAttribute('src', 'images/boat.png')
                }
            }
        }
    },

    /**
     * This function displays the game phase text
     *
     * @function gamePhaseText
     * @pre game phase started
     * @post the html elements for the game phase is created and displayed
     */
    gamePhaseText: function ()
    {
        let title  = document.createElement("h3")
        title.setAttribute('class', 0)
        title.innerText = "In this part of the game you will start by again handing the computer to Player 1. Player 1 will then click on the 'Next Turn' button to reveal their pieces on the left board. The player will then make their guess on the right side of the board and then hit the 'Next Turn' button once after the button is clicked the left side of the board will go blank and you will hand it over to the other player. Then the other player will hit the 'Next Turn' button again and their pieces will be display on the left board"
        view.body.appendChild(title)

        let nxtButton = document.createElement("button")
        nxtButton.setAttribute('id','nextbutton')
        nxtButton.innerText = "Next Turn"

        //Event listeners for the next turn button
        nxtButton.addEventListener('click', () =>
        {
            view.gamePhasePlayerTag.innerText = "Player " + (model.player+1) + "'s turn"

            //displays your board and waits until the user clicks the target and hits the next button
            if(model.firstGamePhase == 0)
            {
                model.gameState = 2

                //If it is player two then remove the h5 element
                if(model.player != 0)
                {
                    view.body.querySelector("h5").remove()
                }

                view.body.appendChild(view.gamePhasePlayerTag)
                view.displayShips()
                model.changeTurn()
                view.displayHits()
                view.displaySunk()
                view.displayMisses()
                model.changeTurn()
                model.firstGamePhase = 1
            }
            //After the person selects their target and hits the next button it will then check if thats a valid spot and then handle accordingly
            else if(model.firstGamePhase == 1)
            {
                //If the box is clicked
                if(model.boxClickedRight != -1)
                {
                    //Makes sure that if the user makes an error it doesn't change the turn
                    if(model.error == 0)
                    {
                        model.changeTurn()
                    }
                    model.firstGamePhase = 2
                    model.extractShipType()
                    model.gameState = 3
                    model.fire()
                    view.displayHits()
                    view.displaySunk()
                    view.displayMisses()

                    //Checks for a winner and then runs the display winner if a winner is annouced
                    if(model.checkWinner())
                    {
                        console.log("Player " + (model.player+1) + "'s the Winner!!")
                        view.removeGamePhaseText()
                        view.displayWinner()
                    }
                    model.boxClickedRight = -1
                }
                //If a box isn't clicked it prompts the user and returns back to where the user for select a box
                else
                {
                    alert("Please select a box to hit")
                    model.gameState = 2
                    model.firstGamePhase = 1
                }
            }
            //Once the users turn is over it will display a screen that protects the piece when you hand the other player the computer
            else
            {
                view.clearLeftBoard()
                view.clearRightBoard()
                model.firstGamePhase = 0
                if(model.player == 1 && model.modelprompt == 2)
                {
                    view.hitByAi()
                    nxtButton.click()
                }
            }
        })
        view.body.appendChild(nxtButton)
    },

    /**
     * This function is in charge of displaying the hits
     *
     * @function DisplayHits
     * @pre None
     * @post Displays the hits on the board based on the players turn and displays when a persons ship has been hit as well
     */
    displayHits: function ()
    {
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.boards[1].querySelector(`[data-id = "${temp}"]`).setAttribute('src', 'images/hit.png')
                }
            }
        }
        model.changeTurn()
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.boards[0].querySelector(`[data-id = "${temp-100}"]`).setAttribute('src', 'images/hit.png')
                }
            }
        }
        model.changeTurn()
    },

    /**
     * This function is in charge of displaying the sunked ships
     *
     * @function displaySunk
     * @pre None
     * @post Displays which boats at sunk for both the boats that you are shooting and your boats
     */
    displaySunk: function ()
    {
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.sunkCount += 1
                    view.sunkArr.push(temp)
                    if(view.sunkCount == i+1)
                    {
                        for(let k = 0; k < view.sunkCount; k++)
                        {
                            view.boards[1].querySelector(`[data-id = "${view.sunkArr[k]}"]`).setAttribute('src', 'images/sunk.png')
                        }
                    }
                }
            }
            view.sunkCount = 0
            view.sunkArr = []
        }
        model.changeTurn()
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.sunkCount += 1
                    view.sunkArr.push(temp)
                    if(view.sunkCount == i+1)
                    {
                        for(let k = 0; k < view.sunkCount; k++)
                        {
                            view.boards[0].querySelector(`[data-id = "${view.sunkArr[k]-100}"]`).setAttribute('src', 'images/sunk.png')
                        }
                    }
                }
            }
            view.sunkCount = 0
            view.sunkArr = []
        }
        model.changeTurn()
    },

    /**
     * This function displays the missed hits
     *
     * @function displayMisses
     * @pre None
     * @post Displays the misses of the player whose turn it is
     */
    displayMisses: function ()
    {
        for(i=0; i<model.playerMisses.length; i++)
        {
            view.boards[1].querySelector(`[data-id = "${model.playerMisses[i]}"]`).setAttribute('src', 'images/waves.png')
        }
    },

     /**
      * This function removes the GamePhase Text
      *
      * @function removeGamePhaseText
      * @pre game phase ends
      * @post removes the html elements for the game phase text
      */
    removeGamePhaseText: function ()
    {
        view.body.querySelector("h3").remove()

        view.body.querySelector("button").remove()

        view.body.querySelector("h5").remove()
    },

    /**
     * This function displays the
     *
     * @function displayWinner
     * @pre once a winner is decided
     * @post displays the winner and asks the user if they want to restart the game
     */
    displayWinner: function ()
    {
        let title = document.createElement("h1")
        title.innerText = "The Winner is Player " + (model.winner+1)

        let instruct = document.createElement("h4")
        instruct.innerText = "If you want to restart the game please click on the button below"

        let button = document.createElement("button")
        button.innerText = "Restart"

        button.addEventListener('click', () =>
        {
           location.reload(1)
        })

        view.body.appendChild(instruct)
        view.body.appendChild(title)
        view.body.appendChild(button)
    },

    /**
     * This function displays the game phase
     *
     * @function displayGamePhase
     * @pre set up phase ends
     * @post Displays the html elements for the game phase
     */
    displayGamePhase: function()
    {
        let gameButton = document.createElement("button")
        gameButton.innerText = "Click here to start the game phase"
        gameButton.setAttribute('data-button', 3)
        gameButton.addEventListener('click', () => {
            view.clearOrientation()
            view.clearLeftBoard()
            view.gamePhaseText()
            view.body.querySelector(`[data-button = "${3}"]`).remove()
        })
        view.body.querySelector("h2").remove()
        view.body.appendChild(gameButton)

    },


    /////////////////////new part////////////////////////

    /**
     * Variable used to store ships's times for hard model
     *
     * @member hardDifficultynum
     * @type {number}
     */
    hardDifficultynum: 0,

    /**
     * Variable used to store mediun difficulty's point when hitted the ship
     *
     * @member mediumDifficultyStartPoint
     * @type  {number}
     */
     mediumDifficultyStartPoint: -1,

    /**
     * Variable used to store mediun difficulty's next point to hit
     *
     * @member mediumDifficultyNextPoint
     * @type
     */
    mediumDifficultyNextPoint: { up:0, righ:0, down:0, left:0 },

    /**
     * Variable used to store mediun difficulty's next point to hit
     *
     * @member mediumDifficultyOrientation
     * @type  {number}
     */
    mediumDifficultyOrientation: 0,

    /**
     * Variable used to store mediun difficulty's next point to hit
     *
     * @member mediumDifficultyShipType
     * @type  {number}
     */
    mediumDifficultyShipType: -1,



    /**
     * This function takes random number reference by website
     *
     * @function getRandomInt
     * @pre set up min and max
     * @post return random numbers
     */

    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    },

	/**
     * This function checks the if the ships are placed correclty
     *
     * @function checkplace
     * @pre
     * @post true for correct place, else false
     */
    checkplace: function()
    {
        if(view.userOrientSelected == 0)
            {
                var tempVar  = -10
            }
            else if(view.userOrientSelected == 1)
            {
                var tempVar = 1
            }
            else if(view.userOrientSelected == 2)
            {
                var tempVar = 10
            }
            else if(view.userOrientSelected == 3)
            {
                var tempVar = -1
            }

            for(let i=0; i<model.placementCounter; i++)
            {
                if(model.checkBounds() && model.checkOverlap())
                {
                    console.log(model.playerShips)
                    model.boxClicked = model.boxClicked+tempVar
                }
                else
                {
                    return false
                }
            }
            return true

    },

    /**
     * This function takes randomly get a position to hit
     *
     * @function hitByAi
     * @pre
     * @post it works when player1 click "Next Turn"
     */

    hitByAi: function()  {
        var tempbutton = document.getElementById("nextbutton")
        tempbutton.click()
        if (model.aidifficulty == 1)
        {
            do{
                var tempnum = view.getRandomInt(100,189)
            }while(!model.checkMissAlreadyForAi(tempnum) || !model.checkHitAlreadyForAi(tempnum))
            var tempbox = document.getElementById(tempnum).click()
            nextbutton.click()
            nextbutton.click()
        }
        if(model.aidifficulty == 2)
        {
            this.mediumHit()
            nextbutton.click()
            nextbutton.click()
        }
        if (model.aidifficulty == 3)
        {
            var tempbox = document.getElementById(model.storeShipsForAi[this.hardDifficultynum]+100).click()
            this.hardDifficultynum ++
            nextbutton.click()
            nextbutton.click()
        }
    },

    /**
     * This function get an hit for mediun model
     *
     * @function mediumHit
     * @pre
     * @post
     */
    mediumHit: function()
     {
        if(this.mediumDifficultyStartPoint != -1)
        {
            if(model.shipsP1[mediumDifficultyShipType].hits.length == mediumDifficultyShipType + 1)
           {
                this.mediumDifficultyStartPoint = -1
                this.mediumDifficultyOrientation = 0

           }
        }
        if(this.mediumDifficultyStartPoint == -1)
        {
            do{
                var tempnum = view.getRandomInt(100,189)
            }while(!model.checkMissAlreadyForAi(tempnum) || !model.checkHitAlreadyForAi(tempnum))
            if(model.storeShipsForAi.includes(tempnum - 100))
            {
                this.mediumDifficultyStartPoint = tempnum - 100
                this.mediumDifficultyNextPoint.up = tempnum - 100
                this.mediumDifficultyNextPoint.right = tempnum - 100
                this.mediumDifficultyNextPoint.down = tempnum - 100
                this.mediumDifficultyNextPoint.left = tempnum - 100
                for(let i = 0; i<model.promptVar; i++)
                {
                    if(model.shipsP1[i].location.includes(tempnum - 100))
                    {
                        mediumDifficultyShipType = i
                    }
                }
            }
            var tempbox = document.getElementById(tempnum).click()
        }
        else
        {
            var correct = 1
            if(this.mediumDifficultyOrientation  == 0)
            {
                if(model.shipsP1[mediumDifficultyShipType].hits.length == mediumDifficultyShipType + 1)
                {
                    this.mediumDifficultyStartPoint = -1
                    this.mediumDifficultyOrientation = 0
                }

                do
                {
                    correct = 1
                    if(this.mediumDifficultyNextPoint.up - 10 < 0)
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }
                    else if (!model.checkMissAlreadyForAi(this.mediumDifficultyNextPoint.up - 10+100))
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }else if (!model.checkHitAlreadyForAi(this.mediumDifficultyNextPoint.up - 10+100))
                    {
                        this.mediumDifficultyNextPoint.up = this.mediumDifficultyNextPoint.up - 10
                        correct = 0
                    }
                    else
                    {
                        this.mediumDifficultyNextPoint.up = this.mediumDifficultyNextPoint.up - 10
                        if(!model.storeShipsForAi.includes(this.mediumDifficultyNextPoint.up))
                        {
                            this.mediumDifficultyOrientation++
                        }
                        document.getElementById(this.mediumDifficultyNextPoint.up+100).click()
                    }
                }while(correct == 0)


            }
            if (this.mediumDifficultyOrientation == 1)
            {
                do
                {
                    correct = 1
                    if(this.mediumDifficultyNextPoint.right+1 > 90 || this.mediumDifficultyNextPoint.right +1 % 10 == 0)
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }
                    else if (!model.checkMissAlreadyForAi(this.mediumDifficultyNextPoint.right +1 +100))
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }else if (!model.checkHitAlreadyForAi(this.mediumDifficultyNextPoint.right +1 +100))
                    {
                        this.mediumDifficultyNextPoint.right = this.mediumDifficultyNextPoint.right + 1
                        correct = 0
                    }
                    else
                    {
                        this.mediumDifficultyNextPoint.right = this.mediumDifficultyNextPoint.right + 1
                        if(!model.storeShipsForAi.includes(this.mediumDifficultyNextPoint.right))
                        {
                            this.mediumDifficultyOrientation++
                        }
                        document.getElementById(this.mediumDifficultyNextPoint.right+100).click()
                    }
                }while(correct == 0)

            }
            if (this.mediumDifficultyOrientation == 2)
            {
                do
                {
                    correct = 1
                    if(this.mediumDifficultyNextPoint.down + 10 > 89)
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }
                    else if (!model.checkMissAlreadyForAi(this.mediumDifficultyNextPoint.down +10 +100))
                    {
                        this.mediumDifficultyOrientation++
                        break
                    }else if (!model.checkHitAlreadyForAi(this.mediumDifficultyNextPoint.down +10 +100))
                    {
                        this.mediumDifficultyNextPoint.down = this.mediumDifficultyNextPoint.down + 10
                        correct = 0
                    }
                    else
                    {
                        this.mediumDifficultyNextPoint.down = this.mediumDifficultyNextPoint.down + 10
                        if(!model.storeShipsForAi.includes(this.mediumDifficultyNextPoint.down))
                        {
                            this.mediumDifficultyOrientation++
                        }
                        document.getElementById(this.mediumDifficultyNextPoint.down+100).click()
                    }
                }while(correct == 0)

            }
            if(this.mediumDifficultyOrientation == 3)
            {
                do
                {
                    correct = 1
                    if(this.mediumDifficultyNextPoint.left - 1 < 0 || this.mediumDifficultyNextPoint.left - 1 % 10 == 9)
                    {
                        alert('h')
                        break
                    }
                    else if (!model.checkMissAlreadyForAi(this.mediumDifficultyNextPoint.left -1 +100))
                    {
                        alert('h')
                        break
                    }else if (!model.checkHitAlreadyForAi(this.mediumDifficultyNextPoint.left -1 +100))
                    {
                        this.mediumDifficultyNextPoint.left = this.mediumDifficultyNextPoint.left -1
                        correct = 0
                    }
                    else
                    {
                        this.mediumDifficultyNextPoint.left = this.mediumDifficultyNextPoint.left + -1
                        document.getElementById(this.mediumDifficultyNextPoint.left+100).click()
                    }
                }while(correct == 0)

            }

        }
     },




}
