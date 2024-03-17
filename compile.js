const tokenizer = (input) => {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    // Skip white spaces
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // Variables and characters
    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (cursor < input.length && /[a-zA-Z0-9]/.test(char)) {
        word += char;
        cursor++;
        char = input[cursor];
      }
      if (word === "strive" || word === "namaste") {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char)) {
      let num = "";
      while (cursor < input.length && /[0-9]/.test(char)) {
        num += char;
        cursor++;
        char = input[cursor];
      }
      tokens.push({ type: "number", value: parseInt(num) });
      continue;
    }

    // Operators
    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({ type: "operator", value: char });
      cursor++;
      continue;
    }

    // Handle unknown characters or unexpected situations
    // You can add your custom logic here

    // Move cursor forward if none of the conditions match
    cursor++;
  }
  return tokens;
};

//ast --> parsing
const parser = (tokens) => {
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length) {
    let token = tokens.shift();
    //variables
    if (token.type === "keyword" && token.value === "strive") {
      let declaration = {
        type: "Declaration",
        name: tokens.shift().value,
        value: null,
      };
      //operators
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift(); //consumes =
        let expression = ""; //eg. 10+20
        while (tokens.length && tokens[0].type != "keyword") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }

      ast.body.push(declaration);
    }

    if (token.type === "keyword" && token.value === "namaste") {
      ast.body.push({
        type: "Print",
        expression: tokens.shift().value,
      });
    }
  }
  return ast;
};

//IGE--> Code Generation
const codeGen = (node) => {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGen).join("\n");
    case "Declaration":
      return `const ${node.name} = ${node.value};`;
    case "Print":
      return `return (${node.expression})`;
  }
};
//compiles the code
const compiler = (input) => {
  //tokenization --> Lexical Analysis
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const codeGenerator = codeGen(ast);
  return codeGenerator;
};

const runner = (input) => {
  try {
    const executeCode = new Function(input);
    const result = executeCode();
    console.log("Execution Result:", result); // Log the execution result
    return result;
  } catch (error) {
    console.error("Error during code execution:", error);
    return null;
  }
};

// Run button click event
document.getElementById("runButton").addEventListener("click", function () {
  const inputCode = document.getElementById("input").value;
  const compiledCode = compiler(inputCode);

  // Execute the compiled code and store the result
  const executionResult = runner(compiledCode);

  // Display the execution result in the output textarea
  const outputElement = document.getElementById("output");
  outputElement.value =
    executionResult !== null ? executionResult : "Error during code execution";

  // Log the execution result to the console for verification
  console.log("Execution Result:", executionResult);
});
