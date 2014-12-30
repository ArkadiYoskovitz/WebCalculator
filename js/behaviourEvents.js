// Site JavaScript file
// ======================================================================
$(document).ready(initPage);
$(window).resize(function() {
   	fixDrawErrors();
});

// Bind the buttons to their actions
// ======================================================================
function initPage () {
	$(".button.number").click(inputClick);
	$(".button.operation").click(inputClick);
	$(".button.action").click(outputClick);
	$("#undo").click(undoClick);
	$("#redo").click(redoClick);
	$("#clear").click(clearClick);
	fixDrawErrors();
}

// Global Variables
// ======================================================================
var clickStack = [];
var firstInput = true;

// Handling click events
// ======================================================================
function inputClick () {
	if (firstInput) {
		$('#inputView').text("");
		firstInput = false;
	};

	var buttonLabel = $(this).text();
	switch (buttonLabel) {
		case "Clear": case "Redo": case "Undo":
	        break;
	    default:
	    	if (clickStack.length > 0) {
	    		clickStack = [];
	    	};
	        $('#inputView').html($('#inputView').html() + "<span>" + buttonLabel + "</span>");
	}
}

function outputClick () {
	
	var result;
	var expressionArray = $('#inputView').children("span").toArray();
	
	if (expressionArray.length > 0) {
		result = evaluateExpression(expressionArray);
	} else {
		result = "NO expression to evaluate yet";
	};

	$('#outputView').html(result);
}

function undoClick () {
	var stack = $('#inputView').children("span").toArray();

	if (stack.length > 0) {
		clickStack.push(stack.pop());
	};
	
	$('#inputView').html(stack);
}

function redoClick () {
	var stack = $('#inputView').children("span").toArray();

	if (clickStack.length > 0) {
		stack.push(clickStack.pop());
	};
	
	$('#inputView').html(stack);
}

function clearClick () {
	clickStack = [];
	$('#inputView').html("");
	$('#outputView').html("");
}

// Execute Evaluation Functions
// ======================================================================
function evaluateExpression (stack) {
	return calculateValue( runShuntingYard( spanArrayToTextArray( stack ) ) );
}
