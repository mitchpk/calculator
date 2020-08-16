export default class Calculator {
    variables = {
        e: Math.E,
        pi: Math.PI
    };

    tokenise(query) {
        var results = [];
        var tokenRegex = /\s*([A-Za-z]+|\d*\.?\d+|\S)\s*/g;

        var i;
        while ((i = tokenRegex.exec(query)) != null)
            results.push(i[1]);

        function isNumber(token) {
            return token !== undefined && token.match(/^\d*\.?\d+$/) !== null;
        }

        for (i = 0; i < results.length; i++) {
            if (isNumber(results[i]) && results[i - 1] == "-") {
                if (results[i - 2] === undefined || results[i - 2] === "(") {
                    results[i] = "-" + results[i];
                    results.splice(i - 1, 1);
                }
            }
        }
        return results;
    }

    parse(tokens) {
        var position = 0;

        function peek() {
            return tokens[position];
        }

        function consume(token) {
            if (token !== tokens[position])
                throw new Error(`Token '${token}' is not at the current position!`);
            else
                position++;
        }

        function isFunction(token) {
            result = false;

            switch (token) {
                case "sin":
                case "cos":
                case "tan":
                case "log":
                case "ln":
                case "sqrt":
                    result = true;
            }

            return token !== undefined && result;
        }

        function isNumber(token) {
            return token !== undefined && token.match(/^-?\d*\.?\d+$/) !== null;
        }

        function isName(token) {
            return token !== undefined && token.match(/^[A-Za-z]+$/) !== null;
        }

        function parseExpression() {
            var token = peek();

            if (isFunction(token)) {
                consume(token);
                let functionType = token;
                token = parseExpression();
                return { type: functionType, argument: token };
            } else if (isNumber(token)) {
                consume(token);
                return { type: "number", value: token };
            } else if (isName(token)) {
                consume(token);
                return { type: "name", id: token };
            } else if (token === "(") {
                consume(token);
                let expression = parseAddition();
                if (peek() !== ")")
                    throw new SyntaxError("expected )");
                consume(")");
                return expression;
            } else {
                throw new SyntaxError("expected a number, variable, or function");
            }
        }

        function parseExponentiation() {
            var expression = parseExpression();
            var token = peek();
            while (token === "^") {
                consume(token);
                var rhs = parseExpression();
                expression = { type: token, left: expression, right: rhs };
                token = peek();
            }

            return expression;
        }

        function parseMultiplication() {
            var expression = parseExponentiation();
            var token = peek();
            while (token === "*" || token === "/") {
                consume(token);
                var rhs = parseExponentiation();
                expression = { type: token, left: expression, right: rhs };
                token = peek();
            }

            return expression;
        }

        function parseAddition() {
            var expression = parseMultiplication();
            var token = peek();
            while (token === "+" || token === "-") {
                consume(token);
                var rhs = parseMultiplication();
                expression = { type: token, left: expression, right: rhs };
                token = peek();
            }

            return expression;
        }

        var result = parseAddition();
        if (position !== tokens.length)
            throw new SyntaxError("unexpected '" + peek() + "'");

        return result;
    }

    evaluate(branch) {
        switch (branch.type) {
            case "sin": return Math.sin(this.evaluate(branch.argument));
            case "cos": return Math.cos(this.evaluate(branch.argument));
            case "tan": return Math.tan(this.evaluate(branch.argument));
            case "log": return Math.log10(this.evaluate(branch.argument));
            case "ln": return Math.log(this.evaluate(branch.argument));
            case "sqrt": return Math.sqrt(this.evaluate(branch.argument));
            case "number": return parseFloat(branch.value);
            case "name": return this.variables[branch.id] || 0;
            case "+": return this.evaluate(branch.left) + this.evaluate(branch.right);
            case "-": return this.evaluate(branch.left) - this.evaluate(branch.right);
            case "*": return this.evaluate(branch.left) * this.evaluate(branch.right);
            case "/":
                if (this.evaluate(branch.right) === 0)
                    throw new Error("division by zero");
                return this.evaluate(branch.left) / this.evaluate(branch.right);
            case "^": return Math.pow(this.evaluate(branch.left), this.evaluate(branch.right));
        }
    }
}