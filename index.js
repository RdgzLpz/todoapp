// Developed by Oscar Rodríguez

const addTaskButton = document.querySelector( '#btn-add' );
let contentContainer, myTasks, completedTasks, cleanAllToDoContainer, cleanAllCompletedTasks, toDoContainer, toDoList,
     removeItemButton, readyItemButton, myTasksContainer, addTask, inputNewTask, input,errorMessageElement, goBack, 
     completedTasksContainer, completedTasksList;

function start( ) { 
    // Containers
    contentContainer = document.querySelector( '#content-container' );
    cleanAllToDoContainer = document.querySelector( '#clean-all-to-do-container' );
    cleanAllCompletedTasks = document.querySelector( '#clean-all-completed-tasks' );
    myTasksContainer = document.querySelector( '.my-tasks-container' );
    toDoContainer = document.querySelector( '#to-do-container' );
    completedTasksContainer = document.querySelector( '#completed-tasks-container' );

    // Navbar buttons
    myTasks = document.querySelector('#first-button');
    addTask = document.querySelector('#add-task');
    goBack = document.querySelector( '#go-back' );
    completedTasks = document.querySelector('#completed-tasks');
    completedTasksList = document.querySelector( '#completed-tasks-list' );

    myTasks.addEventListener( 'click', switcher );
    addTask.addEventListener( 'click', switcher );
    completedTasks.addEventListener( 'click', switcher );

    inputNewTask = document.querySelector( '#input-task' );
    input = document.querySelector( '#input' );
    errorMessageElement = document.querySelector( '#error-message' )
    input.addEventListener( 'input', ( ) => errorMessageElement.style.display = "none" ); 

    cleanAllToDoContainer.addEventListener( 'click', clearStorage );
    cleanAllCompletedTasks.addEventListener( 'click', clearStorage );
    addTask.addEventListener('click', addTaskRequest);
    addTaskButton.addEventListener( 'click', store );
    goBack.addEventListener( 'click', ( ) => switcher( 'first-button' ) );

    showToDoes( );    
}

function switcher( goBackToTask ) {
    let id = goBackToTask == 'first-button' ? goBackToTask : event.target.id;

    myTasksContainer.style.display = 'none';
    toDoContainer.style.display = 'none';
    inputNewTask.style.display = 'none';
    completedTasksContainer.style.display = 'none';
    inputNewTask.style.display = 'none';

    myTasks.style.borderBottom = 'none';
    addTask.style.borderBottom = 'none';
    completedTasks.style.borderBottom = 'none';

    cleanAllToDoContainer.style.display = 'none';

    switch( id ) {
	case 'first-button':
	    toDoContainer.style.display = 'block';
            showToDoes( );
	    myTasks.style.borderBottom = '1px solid red';
	    break;
	case 'add-task':
   	    inputNewTask.style.display = 'block';
	    addTask.style.borderBottom = '1px solid red';
	    break;
	case 'completed-tasks':
 	    completedTasksContainer.style.display = 'block';
	    showTasksCompleted( );
	    completedTasks.style.borderBottom = '1px solid red';
	    break;
    } 

}

// Prepare the context before adding the task to storage
function addTaskRequest( ) {
    myTasksContainer.style.display = 'none' ;
    toDoContainer.innerHTML = '';

    inputNewTask.classList.remove( 'invisible' );
    inputNewTask.classList.add( 'visible' );  
}

function store( ) {
    let toDoStore = localStorage.getItem( 'toDoApp' ); 
    let isValidate = validateInputData( input );
    if ( isValidate ) {
        if ( toDoStore != null ) {
            localStorage.setItem( 'toDoApp', [ input.value, toDoStore ] );
        } else {
            localStorage.setItem( 'toDoApp', [ input.value ] )
        };
        input.value = '';
    } 
}

// Validate input data
function validateInputData( inputElement) {
    let data = inputElement.value;
    let emptyString = data != '';
    let notTooLong = data.length <= 100;
    let notTooShort = data.length > 3;  
    let notBeginWithSpace = /^\s/.test(data) != true;

    let result = emptyString && notTooLong && notTooShort && notBeginWithSpace;
    console.log(data)
    if (!result) {
	inputElement.valid = 'false';
        errorMessage( inputElement, emptyString, notTooLong, notTooShort, notBeginWithSpace );
    } else {
        errorMessage( inputElement, emptyString, notTooLong, notTooShort, notBeginWithSpace );
    }
    return result;
}

// Check what's the error, then send a message
function errorMessage( inputElement, emptyString, notTooLong, notTooShort, notBeginWithSpace ) {
    let errorMessage = errorMessageElement;

    if ( !emptyString || !notTooLong || !notTooShort || !notBeginWithSpace ) {
    	errorMessage.style.display = 'block';
        if ( !emptyString ) {
	    errorMessage.textContent = "Don't save an empty text.";
    	} else if ( !notTooLong ) {
	      errorMessage.textContent = "This is too long. Write 100 letters as maximum.";
    	} else if ( !notTooShort ) {
	      errorMessage.textContent = "This is too short. At least write 4 letters.";
        } else if ( !notBeginWithSpace ) {
	    errorMessage.textContent = "Don't write a white space first..";
        }
    } else {
    	errorMessage.style.display = 'none';
	inputElement.style.border = '.1px solid gray';
    }

}

// Show the items on screen
function showToDoes( ) {
    
    toDoContainer.innerHTML = '';
    cleanAllToDoContainer.style.display = 'flex';

    if ( localStorage.getItem('toDoApp') != null && localStorage.getItem('toDoApp').length > 1 ) {
	myTasksContainer.style.display = 'none';
        let list = localStorage.getItem('toDoApp').split(',');
        for ( let i = 0; i < list.length; i++ ) { 
	    toDoContainer.innerHTML += '<li class="to-do-item">'+ 
		    				                 '<p>' + Number( i + 1 ) + '. ' + list[ i ] + '</p>' +
							         '<div class="options-item-btn">' +
							             '<button class="rm-item-btn">×</button>' +
							             '<img src="icons/check.svg" alt="icon" class="icon ready-item-btn">' +
							         '</div>' +
						             '</li>';
        }
	// Loop for adding listener for removing single items 
        removeItemButtons = document.querySelectorAll( '.rm-item-btn' );
        readyItemButton = document.querySelectorAll( '.ready-item-btn' );
        for ( let i = 0; i < removeItemButtons.length; i++ ) {
    	    removeItemButtons[ i ].id = i;
	    removeItemButtons[ i ].addEventListener( 'click', removeItem );
        }

	// Loop for adding listener for putting single items as finished
	for ( let i = 0; i < readyItemButton.length; i++ ) {
    	    readyItemButton[ i ].id = i;
	    readyItemButton[ i ].addEventListener( 'click', taskCompleted );
        }
    } else {
    	localStorage.removeItem( 'toDoApp' );
	myTasksContainer.style.display = 'block';
	myTasksContainer.style.height = '100%';
    }
}
 
// Clear all the storage
function clearStorage( ) { 
    if ( event.target.classList.contains( '0' ) ) {
        localStorage.removeItem( 'toDoApp' );
        showToDoes( );
    } else {
	localStorage.removeItem( 'completedTasksListStore' );
        showTasksCompleted( );
    }
}

// Remove item
function removeItem( event ) {
    if ( event.target.id == 0 ) {
	localStorage.setItem( 'toDoApp', localStorage.toDoApp.replace( localStorage.toDoApp.split( ',' )[ event.target.id ], '' ) );
    }
    localStorage.setItem( 'toDoApp', localStorage.toDoApp.replace( ',' + localStorage.toDoApp.split( ',' )[ event.target.id ], '' )  );

    showToDoes( )
}

// finished task successfully
let varCompletedTasksListStore;

function taskCompleted( event ) {
    let itemInStorage = localStorage.toDoApp.split( ',' )[ event.target.id ]; 
    varCompletedTasksListStore = localStorage.getItem( 'completedTasksListStore' );

    if ( varCompletedTasksListStore != null  && varCompletedTasksListStore != undefined ) {
        localStorage.completedTasksListStore = itemInStorage + ',' + varCompletedTasksListStore;
    } else {
        localStorage.setItem( 'completedTasksListStore', itemInStorage )
    }
    removeItem( event );
    showTasksCompleted( );
}

// Show all the tasks completed
function showTasksCompleted( ) {
    const completedTaskTitle = document.querySelector( '#completed-tasks-title' );
    let anyTask = document.querySelector( '#any-task' );
    let completedTasksHeaderContainer = document.querySelector( '#completed-tasks-container header' );

    varCompletedTasksListStore = localStorage.getItem( 'completedTasksListStore' )
    
    if ( varCompletedTasksListStore != undefined && varCompletedTasksListStore != null ) {
        let numberCompletedTasksListStore = localStorage.completedTasksListStore.split( ',' ).length;
 	completedTasksHeaderContainer.className = 'flex';
	anyTask.style.display = 'none';
	completedTaskTitle.style.display = 'block';
 	cleanAllCompletedTasks.style.display = 'flex';

        if ( String( numberCompletedTasksListStore ).length == 2 ) {
	     completedTaskTitle.style.width = '9.5rem';
  	     cleanAllCompletedTasks.style.marginLeft = '17%';
        } else if ( String( numberCompletedTasksListStore ).length == 3 ) {
	    completedTaskTitle.style.width = '10rem';
  	    cleanAllCompletedTasks.style.marginLeft = '16%';
        } else if ( String( numberCompletedTasksListStore ).length == 4 ) {
	    completedTaskTitle.style.width = '10.7rem';
  	    cleanAllCompletedTasks.style.marginLeft = '14%';
        }
																	 
        document.querySelector( '#completed-tasks-title' ).innerHTML = `Total completed:  ${ numberCompletedTasksListStore }`; 
        completedTasksList.innerHTML = '';

        let finishedItems = localStorage.completedTasksListStore.split( ',' );
        for ( let i = 0; i < finishedItems.length; i++ ) {
            completedTasksList.innerHTML += '<li class="completed-item completed-item-flex">'  
	  							          + '<span>' + finishedItems[ i ] + '</span>' 
	  							          + '<img src="icons/check.svg" alt="icon" class="completed-task-icon">' +
								      '</li>';
        }
     } else {
 	cleanAllCompletedTasks.style.display = 'none';
	anyTask.style.display = 'block';
	completedTaskTitle.style.display = 'none';
    	completedTasksList.innerHTML = '';
    }
}

window.addEventListener('load', start);
