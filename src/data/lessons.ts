
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  content: {
    introduction: string;
    concept: string;
    example: {
      code: string;
      explanation: string;
      output: string;
    };
    exercise: {
      instruction: string;
      starterCode: string;
      expectedOutput: string;
    };
  };
}

export const lessons: Lesson[] = [
  {
    id: '1-1',
    title: 'Your First Print Statement',
    description: 'Learn to make Python speak with the print() function',
    difficulty: 1,
    content: {
      introduction: 'Welcome to Python! Every programming journey begins with a simple "Hello, World!" Let\'s make your computer talk.',
      concept: 'The print() function is Python\'s way of displaying text on the screen. Think of it as Python\'s voice - whatever you put inside the parentheses, Python will say out loud.',
      example: {
        code: 'print("Hello, World!")',
        explanation: 'This line tells Python to display the text "Hello, World!" on the screen. Notice the quotation marks - they tell Python this is text, not a command.',
        output: 'Hello, World!'
      },
      exercise: {
        instruction: 'Try changing the message to say "Hello, Python!" instead.',
        starterCode: 'print("Hello, World!")',
        expectedOutput: 'Hello, Python!'
      }
    }
  },
  {
    id: '1-2',
    title: 'Using Variables',
    description: 'Store information in variables like containers',
    difficulty: 1,
    content: {
      introduction: 'Variables are like labeled boxes where you can store information. Just like you might write "goals = 24" on a box to remember how many goals your team scored.',
      concept: 'Variables let you store data and use it later. You create a variable by giving it a name and assigning it a value with the = sign.',
      example: {
        code: 'goals = 24\nprint(goals)',
        explanation: 'First we create a variable called "goals" and store the number 24 in it. Then we print the value stored in that variable.',
        output: '24'
      },
      exercise: {
        instruction: 'Create a variable called "score" with the value 42, then print it.',
        starterCode: '# Create your variable here\n# Print it here',
        expectedOutput: '42'
      }
    }
  },
  {
    id: '1-3',
    title: 'Numbers and Math',
    description: 'Let Python be your calculator',
    difficulty: 1,
    content: {
      introduction: 'Python is great at math! You can use it like a super-powered calculator to add, subtract, multiply, and divide.',
      concept: 'Python uses familiar math symbols: + for addition, - for subtraction, * for multiplication, and / for division.',
      example: {
        code: 'result = 10 + 5\nprint(result)',
        explanation: 'Python calculates 10 + 5 = 15, stores it in the variable "result", then prints the answer.',
        output: '15'
      },
      exercise: {
        instruction: 'Calculate 7 * 6 and store the result in a variable called "answer", then print it.',
        starterCode: '# Calculate 7 * 6 here\n# Print the answer',
        expectedOutput: '42'
      }
    }
  },
  {
    id: '1-4',
    title: 'Working with Text',
    description: 'Combine and manipulate text strings',
    difficulty: 2,
    content: {
      introduction: 'Text in Python is called a "string". You can combine strings, repeat them, and do all sorts of fun things with text.',
      concept: 'You can join strings together using the + operator, just like adding numbers. This is called "concatenation".',
      example: {
        code: 'name = "Python"\ngreeting = "Hello, " + name + "!"\nprint(greeting)',
        explanation: 'We combine "Hello, " with the name "Python" and "!" to create a personalized greeting.',
        output: 'Hello, Python!'
      },
      exercise: {
        instruction: 'Create a variable "language" with value "Python" and combine it with "I love " to make "I love Python".',
        starterCode: '# Create your variables and combine them\n# Print the result',
        expectedOutput: 'I love Python'
      }
    }
  },
  {
    id: '1-5',
    title: 'Getting User Input',
    description: 'Make your programs interactive',
    difficulty: 2,
    content: {
      introduction: 'Real programs interact with users! The input() function lets you ask questions and get answers from whoever is using your program.',
      concept: 'The input() function pauses your program and waits for the user to type something. Whatever they type gets stored as text.',
      example: {
        code: 'name = input("What\'s your name? ")\nprint("Nice to meet you, " + name + "!")',
        explanation: 'This asks the user for their name, stores it in the "name" variable, then creates a personalized greeting.',
        output: 'What\'s your name? [User types: Alice]\nNice to meet you, Alice!'
      },
      exercise: {
        instruction: 'Ask the user "What\'s your favorite color?" and respond with "That\'s a beautiful color!"',
        starterCode: '# Ask for favorite color\n# Print a nice response',
        expectedOutput: 'What\'s your favorite color? [User input]\nThat\'s a beautiful color!'
      }
    }
  },
  {
    id: '1-6',
    title: 'Making Decisions with If',
    description: 'Teach your program to make choices',
    difficulty: 2,
    content: {
      introduction: 'Programs need to make decisions! The "if" statement lets your program choose different actions based on conditions, just like you decide whether to bring an umbrella based on the weather.',
      concept: 'An if statement checks if something is true. If it is, Python runs the code that\'s indented underneath. If not, it skips that code.',
      example: {
        code: 'age = 18\nif age >= 18:\n    print("You can vote!")\nelse:\n    print("Not old enough yet.")',
        explanation: 'This checks if the age is 18 or older. Since 18 >= 18 is true, it prints "You can vote!"',
        output: 'You can vote!'
      },
      exercise: {
        instruction: 'Create a variable "temperature" set to 75. If it\'s over 70, print "It\'s warm!", otherwise print "It\'s cool!"',
        starterCode: '# Set temperature to 75\n# Add your if statement',
        expectedOutput: 'It\'s warm!'
      }
    }
  },
  {
    id: '1-7',
    title: 'Lists - Collections of Data',
    description: 'Store multiple items in one place',
    difficulty: 3,
    content: {
      introduction: 'Sometimes you need to store more than one piece of information. Lists are like containers that can hold multiple items in order.',
      concept: 'Lists are created with square brackets and items separated by commas. You can access individual items using their position (starting from 0).',
      example: {
        code: 'fruits = ["apple", "banana", "orange"]\nprint(fruits[0])\nprint(fruits[1])',
        explanation: 'This creates a list of fruits. fruits[0] gets the first item (apple), and fruits[1] gets the second item (banana).',
        output: 'apple\nbanana'
      },
      exercise: {
        instruction: 'Create a list called "colors" with "red", "blue", "green" and print the second color.',
        starterCode: '# Create your list of colors\n# Print the second color',
        expectedOutput: 'blue'
      }
    }
  },
  {
    id: '1-8',
    title: 'Loops - Repeating Actions',
    description: 'Let Python do repetitive tasks for you',
    difficulty: 3,
    content: {
      introduction: 'Loops are one of programming\'s superpowers! Instead of writing the same code over and over, you can tell Python to repeat actions automatically.',
      concept: 'A "for" loop repeats code for each item in a list or range. It\'s like saying "for each thing in this collection, do this action".',
      example: {
        code: 'for i in range(3):\n    print("Hello number", i)',
        explanation: 'This loop runs 3 times (0, 1, 2) and prints a message each time with the current number.',
        output: 'Hello number 0\nHello number 1\nHello number 2'
      },
      exercise: {
        instruction: 'Create a loop that prints "Python is fun!" 3 times.',
        starterCode: '# Create your loop here',
        expectedOutput: 'Python is fun!\nPython is fun!\nPython is fun!'
      }
    }
  },
  {
    id: '1-9',
    title: 'Functions - Reusable Code',
    description: 'Create your own commands that Python can follow',
    difficulty: 4,
    content: {
      introduction: 'Functions are like creating your own mini-programs within your program. Once you define a function, you can use it over and over again!',
      concept: 'Functions are defined with "def" followed by a name and parentheses. They can take inputs (parameters) and give back outputs (return values).',
      example: {
        code: 'def greet(name):\n    return "Hello, " + name + "!"\n\nmessage = greet("Alice")\nprint(message)',
        explanation: 'This creates a function called "greet" that takes a name and returns a greeting. We call it with "Alice" and print the result.',
        output: 'Hello, Alice!'
      },
      exercise: {
        instruction: 'Create a function called "double" that takes a number and returns it multiplied by 2. Test it with the number 5.',
        starterCode: '# Define your function here\n# Test it with 5',
        expectedOutput: '10'
      }
    }
  },
  {
    id: '1-10',
    title: 'Putting It All Together',
    description: 'Build a complete mini program using everything you\'ve learned',
    difficulty: 5,
    content: {
      introduction: 'Congratulations! You\'ve learned the fundamentals of Python. Now let\'s combine everything into a complete program that showcases your new skills.',
      concept: 'Real programs combine variables, functions, loops, conditionals, and user interaction to create useful applications.',
      example: {
        code: 'def calculate_grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    else:\n        return "C"\n\nscores = [95, 87, 92]\nfor score in scores:\n    grade = calculate_grade(score)\n    print(f"Score: {score}, Grade: {grade}")',
        explanation: 'This program defines a function to calculate letter grades, then processes a list of scores and displays each score with its corresponding grade.',
        output: 'Score: 95, Grade: A\nScore: 87, Grade: B\nScore: 92, Grade: A'
      },
      exercise: {
        instruction: 'Create a program that asks for the user\'s name and age, then tells them how many years until they turn 100.',
        starterCode: '# Ask for name and age\n# Calculate years until 100\n# Print a personalized message',
        expectedOutput: '[Personalized message based on user input]'
      }
    }
  }
];
