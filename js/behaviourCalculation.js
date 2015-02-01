// ======================================================================
// Helper Functions
// ======================================================================
function spanArrayToTextArray(spanArray) {

  var element;
  var stack = [];
  var negCombination = ['+','-','/','*','^','('];
  var textValue = "", errValue = "";

  for (var i = 0; i < spanArray.length; i++) {

    element = spanArray[i].innerHTML;
    
    switch (element) {
      case "1": case "2": case "3": case "4": case "5":
      case "6": case "7": case "8": case "9": case "0": case ".":
          textValue = textValue + element;
        break;
      
      case "-":
          if (i == 0) {
            element = "neg";
          } else if (negCombination.indexOf( spanArray[i - 1].innerHTML ) != -1) {
            element = "neg";
          };

          if (textValue !== "") {
            stack.push(textValue);
            textValue = "";
          };
          stack.push(element)
        break;

      case "/": case "*": case "+":
      case "sqrt": case "^": case "%":
      case "log": case "sin": case "cos": case "tan":
      case "(": case ")":
          if (textValue !== "") {
            stack.push(textValue);
            textValue = "";
          };
          stack.push(element)
        break;

      default:
          errValue = errValue + " " + element;
        break;
    }
  };

  if (textValue !== "") {
    stack.push(textValue);
  };
  return stack;
}
// ====================================================================
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// ====================================================================
function operatorPriority(x){
  switch(x){
    case 'neg': /*Highest priority of unary negation operator*/
      return 4;
    case 'sqrt':
      return 3;
    case '^':
      return 3;
    case '%':
      return 2;
    case '/':
      return 2;
    case '*':
      return 2;
    case '+':
      return 1;
    case '-':
      return 1;
    case '(':
      return 0;
  }
}
// ====================================================================
function operatorAssociativity (x) {
  switch (x) {
    case 'neg':
      return 'Left';
    case 'sqrt':
      return 'Left';
    case '^':
      return 'Right';
    case '%':
      return 'Left';
    case '/':
      return 'Left';
    case '*':
      return 'Left';
    case '+':
      return 'Left';
    case '-':
      return 'Left';
  }
}
// ====================================================================
// Shunting Yard algoritam
// ====================================================================
function runShuntingYard(inputQueue){
  var knownOperators = ['neg','sqrt','^','%','/','*','+','-'];
  var knownFunctions = ['log','sin','cos','tan'];
  var knownFunctionsargumentSeparator = [','];

  var   operatorStack = [];
  var     outputQueue = [];
  
  var token;
  var i;

  // 1. While there are tokens to be read:
  for ( i=0 ; i<inputQueue.length ; i++) {
    
    // 2. Read a token.
    token = inputQueue[i];
  
    // 3. If the token is a number
    if (isNumeric(token)) {

      // 4. Add it to the output queue
      outputQueue.push(token);
    
    } // 5. If the token is a function token
      else if (knownFunctions.indexOf(token) != -1) {

      // 6. Push it onto the stack.
      operatorStack.push(token);

    } // 7. If the token is a function argument separator (e.g., a comma):
      else if (knownFunctionsargumentSeparator.indexOf(token) != -1) {

      // 8. Until the token at the top of the stack is a left parenthesis
      while ( operatorStack[operatorStack.length-1] != '(' ) {

        // 9. Pop operators off the stack onto the output queue.
        outputQueue.push(operatorStack.pop());
      };

    } // 10. If the token is an operator, o1, then:
      else if (knownOperators.indexOf(token) != -1) {
      /*
      // 11. while there is an operator token, o2, at the top of the stack, 
      //    and either o1 is left-associative and its precedence is *less than or equal* to that of o2,
      //    or o1 if right associative, and has precedence *less than* that of o2
      */

      var o1 = token;
      var o2 = operatorStack[operatorStack.length-1]; //top operator of the operator stack

      while ( (knownOperators.indexOf(o2) != -1) && (
              (operatorAssociativity(o1) == "Left"  && (operatorPriority(o1) <= operatorPriority(o2)) ) || 
              (operatorAssociativity(o1) == "Right" && (operatorPriority(o1) <  operatorPriority(o2)) ) )  ) {
        // 12. Pop o2 off the stack, onto the output queue;
        outputQueue.push(operatorStack.pop());
        o2 = operatorStack[operatorStack.length-1]
      };

      // 13. push o1 onto the stack.
      operatorStack.push(token);

    } // 14. If the token is a left parenthesis
      else if ( token == '(' ) {

      // 15. Push it onto the stack.
      operatorStack.push(token);

    } // 16. If the token is a right parenthesis:
      else if ( token ==')') {

      // 17. Until the token at the top of the stack is a left parenthesis
      while ( operatorStack[operatorStack.length-1] != '(' ) {

        // 18. Pop operators off the stack onto the output queue.
        outputQueue.push(operatorStack.pop());
      
      };

      // 19. Pop the left parenthesis from the stack, but not onto the output queue.
      operatorStack.pop();

      // 20. If the token at the top of the stack is a function token
      if (knownFunctions.indexOf(operatorStack.length-1) != -1 ) {

        // 21. pop it onto the output queue.
        outputQueue.push(operatorStack.pop());
      };
    };
  };

  // 22. When there are no more tokens to read

  // 23. While there are still operator tokens in the stack
  while (operatorStack.length !== 0) {

    // 24. If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
    if (operatorStack[operatorStack.length] === ")") {
      alert("1.Error! You have entered a bad expression");
    };

    // 25. Pop the operator onto the output queue.
    outputQueue.push(operatorStack.pop());
  };
  // 26. Exit
  return outputQueue;
}

function isTrigonometricFunction(tokens) {
  
  if ( ( tokens.indexOf('log') !== -1 ) || ( tokens.indexOf('sin') !== -1 ) || 
       ( tokens.indexOf('cos') !== -1 ) || ( tokens.indexOf('tan') !== -1 ) ) {
    return true;
  };

  return false;
}

// ====================================================================
function calculateValue(rpnTokens) {
  var stack = [];
  var element;
  var v,n;
  
  var precisionFlag = isTrigonometricFunction(rpnTokens);
  
  for (var i = 0; i < rpnTokens.length; i++) {
    
    element = rpnTokens[i];
    
    if ( isNumeric(element) ) {
        stack.push( Number(element) );
        continue;
    };
    
    switch (element) {
      case '+':
          stack.push( stack.pop() + stack.pop() );
          break;
      case '-':
          n = stack.pop();
          stack.push( stack.pop() - n );
          break;
      case '*':
          stack.push( stack.pop() * stack.pop() );
          break;
      case '/':
          n = stack.pop();
          stack.push( stack.pop() / n) ;
          break;
      case '%':
          n = stack.pop();
          stack.push( stack.pop() % n );
          break;
      case '^':
          n = stack.pop();
          stack.push( Math.pow( stack.pop(), n ) );
          break;
      case 'sqrt':
          stack.push( Math.sqrt( stack.pop() ) );
          break;
      case 'neg':
          if (stack.length > 0) {
            stack.push( 0 - stack.pop() );
          } else {
            rpnTokens[ i + 1 ] = 0 - rpnTokens[ i + 1 ];
          };
          break;
      case 'log':
          stack.push( Math.log( stack.pop() ) / Math.LN10 );
          break;
      case 'sin':
          stack.push( Math.sin( stack.pop() * ( Math.PI / 180 ) ) );
          break;
      case 'cos':
          stack.push( Math.cos( stack.pop() * ( Math.PI / 180 ) ) );
          break;
      case 'tan':
          stack.push( Math.tan( stack.pop() * ( Math.PI / 180 ) ) );
          break;
      default:
          break;
    }
  };

  if ( jQuery.inArray(NaN,stack) != -1 ) {
    alert("2.Error! You have entered a bad expression");
  };

  if (precisionFlag) {
    return stack[0];
  } else {
    return stack[0].toFixed(2);
  }
}
