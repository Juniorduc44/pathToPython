/**
 * @file lessons.ts
 * @version 1.1.0
 * @description Defines the curriculum structure for Python Quest, including chapters and lessons.
 * This file serves as the central repository for all educational content.
 * It is designed for scalability and easy maintenance to support a premium learning experience.
 *
 * @project Python Quest - A Gamified Python Learning Platform
 * @author Factory AI Development Team
 * @date May 31, 2025
 */

// =====================================================================================
// INTERFACE DEFINITIONS
// =====================================================================================
// These interfaces define the shape of the data for chapters and lessons,
// ensuring consistency and type safety throughout the application.
// =====================================================================================

/**
 * @interface Chapter
 * @description Represents a chapter in the Python Quest curriculum.
 * Each chapter groups a set of related lessons, forming a logical unit of learning.
 */
export interface Chapter {
  /** 
   * @property {number} id - Unique numerical identifier for the chapter. 
   * Used for ordering and referencing.
   */
  id: number;
  /** 
   * @property {string} title - The main title of the chapter, displayed to the user.
   * Should be concise and descriptive of the chapter's theme.
   */
  title: string;
  /** 
   * @property {string} description - A brief overview of the chapter's content and key learning objectives.
   * This helps users understand what they will learn in this chapter.
   */
  description: string;
}

/**
 * @interface Lesson
 * @description Represents a single, atomic lesson within a chapter.
 * Each lesson provides educational content, practical code examples, and interactive exercises
 * to reinforce learning.
 */
export interface Lesson {
  /** 
   * @property {string} id - Unique string identifier for the lesson (e.g., "1-1" for Chapter 1, Lesson 1).
   * This format helps in organizing and referencing lessons programmatically.
   */
  id: string;
  /** 
   * @property {number} chapterId - The numerical ID of the chapter this lesson belongs to.
   * Links the lesson to its parent chapter.
   */
  chapterId: number;
  /** 
   * @property {string} title - The title of the lesson, displayed to the user.
   * Should clearly indicate the lesson's specific topic.
   */
  title: string;
  /** 
   * @property {string} description - A short summary of what the lesson covers.
   * Provides a quick glimpse into the lesson's content.
   */
  description: string;
  /** 
   * @property {number} difficulty - A numerical rating (typically 1-5) indicating the lesson's perceived difficulty.
   * Helps users gauge the challenge level and allows for adaptive learning paths in future.
   * 1: Beginner, 5: Advanced.
   */
  difficulty: number;
  /**
   * @property {object} content - Contains the detailed educational material for the lesson.
   * This object structures the various components of a lesson's content.
   */
  content: {
    /** 
     * @property {string} content.introduction - An engaging introductory paragraph or section for the lesson's topic.
     * Aims to capture student interest and set the context.
     */
    introduction: string;
    /** 
     * @property {string} content.concept - In-depth explanation of the core programming concepts being taught.
     * This is the main teaching section of the lesson.
     */
    concept: string;
    /** 
     * @property {object} content.example - A practical code example demonstrating the concept.
     * Illustrates the concept in action.
     */
    example: {
      /** @property {string} content.example.code - The example Python code snippet. */
      code: string;
      /** @property {string} content.example.explanation - A step-by-step explanation of the example code. */
      explanation: string;
      /** @property {string} content.example.output - The expected output when the example code is run. */
      output: string;
    };
    /** 
     * @property {object} content.exercise - An interactive exercise for the student to practice the concept.
     * Provides hands-on application of the learned material.
     */
    exercise: {
      /** @property {string} content.exercise.instruction - Clear instructions for the exercise. */
      instruction: string;
      /** @property {string} content.exercise.starterCode - Initial Python code provided to the student to begin the exercise. */
      starterCode: string;
      /** @property {string} content.exercise.expectedOutput - The expected output for a correct solution to the exercise. Used for validation. */
      expectedOutput: string;
    };
  };
}

// =====================================================================================
// PYTHON QUEST CURRICULUM DATA
// =====================================================================================
// This section defines all chapters and lessons for the Python Quest platform.
// The curriculum is designed to be progressive, building foundational knowledge
// before moving to more advanced topics. Each chapter aims for approximately 10 lessons.
//
// Curriculum Design Principles:
// - Progressive Difficulty: Lessons within chapters, and chapters themselves, increase in complexity.
// - Practical Application: Emphasis on real-world examples and hands-on exercises.
// - Engagement: Content is written to be engaging for a wide audience, from kids to adults.
// - Modularity: Chapters and lessons are self-contained units where possible, allowing for
//   potential future features like custom learning paths or topic reviews.
//
// To add new content (for future expansion):
// 1. Define a new chapter object in the `chapters` array if creating a new chapter.
//    Ensure the `id` is unique and sequential.
// 2. Add new lesson objects to the `lessons` array.
//    - `chapterId` must match the ID of the chapter the lesson belongs to.
//    - `id` should follow the "chapterId-lessonNumber" format (e.g., "5-1" for Chapter 5, Lesson 1).
//    - `difficulty` should be appropriately set.
// 3. Ensure all lesson `content` fields (introduction, concept, example, exercise)
//    are populated with high-quality, accurate, and engaging educational material.
// 4. Test thoroughly by running the application and navigating to the new content.
// =====================================================================================

/**
 * @const {Chapter[]} chapters
 * @description An array of all chapters in the Python Quest curriculum.
 * Defines the high-level structure of the learning path.
 */
export const chapters: Chapter[] = [
  // Chapter 1: Python Fundamentals
  // Learning Objectives: Students will grasp the foundational elements of Python programming.
  // This includes understanding basic syntax, data output, variable usage, arithmetic,
  // string manipulation, user interaction, conditional logic, and the elementary
  // concepts of data collections (lists), iteration (loops), and code modularity (functions).
  // The chapter aims to build a solid base for more complex topics.
  {
    id: 1,
    title: "Python Fundamentals",
    description: "Learn the basics of Python programming"
  },
  // Chapter 2: Control Flow & Logic
  // Learning Objectives: Students will master the techniques for controlling the execution
  // path of their programs. This involves in-depth understanding of conditional statements
  // (if-elif-else), logical operators (and, or, not), different types of loops (while, for with range),
  // loop control statements (break, continue), nested loops, and modern pattern matching (match-case).
  // The focus is on building robust decision-making capabilities in code.
  {
    id: 2,
    title: "Control Flow & Logic",
    description: "Master decision making and program flow in Python"
  },
  // Chapter 3: Functions & Modules
  // Learning Objectives: This chapter focuses on writing modular, reusable, and organized code.
  // Students will learn to define and use functions, understand parameter passing (including defaults and keywords),
  // manage variable scope, utilize lambda functions for concise operations, and leverage Python's
  // module system by importing from the standard library and creating their own modules.
  // Advanced topics like decorators and recursion are also introduced.
  {
    id: 3,
    title: "Functions & Modules",
    description: "Create reusable code and organize your programs"
  },
  // Chapter 4: Data Structures
  // Learning Objectives: Students will explore Python's versatile built-in data structures
  // for organizing and managing complex data. This includes in-depth coverage of lists,
  // dictionaries, tuples, and sets. Advanced list/dict/set comprehensions, nested data structures,
  // named tuples, data classes, specialized containers from the `collections` module,
  // and working with JSON data are key topics.
  {
    id: 4,
    title: "Data Structures",
    description: "Work with complex data using Python's built-in structures"
  },
  // Chapter 5: File & Data Handling (Placeholder for future content)
  // Learning Objectives (Anticipated): Reading from and writing to files (text, binary, CSV, JSON),
  // understanding file paths and modes, context managers for file operations,
  // working with different data serialization formats, and basic data processing pipelines.
  {
    id: 5,
    title: "File & Data Handling",
    description: "Read, write, and process data from various sources"
  },
  // Chapter 6: Object-Oriented Programming (Placeholder for future content)
  // Learning Objectives (Anticipated): Principles of OOP (encapsulation, inheritance, polymorphism),
  // defining classes and creating objects, understanding attributes and methods, constructors (__init__),
  // special methods (dunder methods), inheritance hierarchies, and basic design patterns.
  {
    id: 6,
    title: "Object-Oriented Programming",
    description: "Design programs using classes and objects"
  },
  // Chapter 7: Error Handling & Debugging (Placeholder for future content)
  // Learning Objectives (Anticipated): Understanding different types of errors, using try-except blocks
  // for exception handling, raising custom exceptions, the `finally` clause, debugging techniques,
  // using a debugger, logging best practices, and writing robust, fault-tolerant code.
  {
    id: 7,
    title: "Error Handling & Debugging",
    description: "Write robust code that handles exceptions gracefully"
  },
  // Chapter 8: Libraries & Packages (Placeholder for future content)
  // Learning Objectives (Anticipated): Exploring popular Python libraries (e.g., `requests` for HTTP,
  // `Pillow` for image processing, `NumPy` for numerical computing - introductory),
  // understanding package management with `pip`, virtual environments, and how to find and use
  // third-party packages to extend Python's capabilities.
  {
    id: 8,
    title: "Libraries & Packages",
    description: "Leverage Python's powerful ecosystem of libraries"
  },
  // Chapter 9: Data Science Basics (Placeholder for future content)
  // Learning Objectives (Anticipated): Introduction to data analysis concepts, using `pandas` for
  // data manipulation (DataFrames, Series), basic data cleaning and transformation,
  // an introduction to `Matplotlib` or `Seaborn` for data visualization, and simple statistical analysis.
  {
    id: 9,
    title: "Data Science Basics",
    description: "Analyze and visualize data with Python"
  },
  // Chapter 10: Advanced Python Modules (Placeholder for future content)
  // Learning Objectives (Anticipated): Deeper dives into specific advanced areas such as
  // web scraping (e.g., `BeautifulSoup`, `Scrapy`), an introduction to web frameworks (e.g., `Flask` or `Django`),
  // basic machine learning concepts with `scikit-learn`, or asynchronous programming with `asyncio`.
  // This chapter can be tailored to current industry trends.
  {
    id: 10,
    title: "Advanced Python Modules",
    description: "Explore web scraping, machine learning, and more"
  }
];

/**
 * @const {Lesson[]} lessons
 * @description An array of all lessons in the Python Quest curriculum.
 * Lessons are structured to provide a clear progression of learning.
 */
export const lessons: Lesson[] = [
  // =======================================================================
  // CHAPTER 1: PYTHON FUNDAMENTALS
  // =======================================================================
  // This chapter introduces the core building blocks of Python programming.
  // Lesson Progression: Starts with simple output, moves to variables,
  // basic operations, text manipulation, user input, decision making (if),
  // and then introduces fundamental structures: lists, loops, and functions.
  // Each lesson builds upon the previous, culminating in a final project.
  // -----------------------------------------------------------------------
  {
    id: '1-1',
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
    chapterId: 1,
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
        expectedOutput: '[Personalized message based on user input]' // Expected output can be more descriptive for complex exercises
      }
    }
  },

  // =======================================================================
  // CHAPTER 2: CONTROL FLOW & LOGIC
  // =======================================================================
  // This chapter delves into how programs make decisions and repeat actions.
  // Lesson Progression: Builds on basic 'if' from Chapter 1, introducing
  // 'elif' and 'else', logical operators, 'while' loops, advanced 'for' loop
  // usage with 'range', loop control ('break', 'continue'), nested loops,
  // and finishes with modern pattern matching ('match-case') and complex challenges.
  // -----------------------------------------------------------------------
  {
    id: '2-1',
    chapterId: 2,
    title: 'If-Elif-Else Statements',
    description: 'Create multi-way decision branches in your code',
    difficulty: 2,
    content: {
      introduction: 'Real-world decisions often have more than two options. Python\'s if-elif-else structure lets you handle multiple conditions elegantly.',
      concept: 'The elif (short for "else if") statement lets you check multiple conditions in sequence. Python checks each condition until one is True, then executes that code block. The final `else` block is optional and runs if no preceding `if` or `elif` condition was met.',
      example: {
        code: 'score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: C")\nelif score >= 60:\n    print("Grade: D")\nelse:\n    print("Grade: F")',
        explanation: 'This code checks the score against multiple thresholds. Since 85 is between 80 and 90 (specifically, `score >= 80` is true after `score >= 90` is false), it prints "Grade: B".',
        output: 'Grade: B'
      },
      exercise: {
        instruction: 'Create a program that categorizes temperature: "Cold" if below 50, "Cool" if 50-69 (inclusive), "Warm" if 70-85 (inclusive), and "Hot" if above 85. Test with temperature 75.',
        starterCode: 'temperature = 75\n# Write your if-elif-else structure here',
        expectedOutput: 'Warm'
      }
    }
  },
  {
    id: '2-2',
    chapterId: 2,
    title: 'Logical Operators',
    description: 'Combine conditions with AND, OR, and NOT',
    difficulty: 2,
    content: {
      introduction: 'Sometimes you need to check multiple conditions at once. Logical operators let you combine conditions to create complex decision logic.',
      concept: 'Python uses "and", "or", and "not" to combine conditions. \n- `A and B` is True only if both A and B are True.\n- `A or B` is True if at least one of A or B is True.\n- `not A` is True if A is False, and False if A is True.',
      example: {
        code: 'age = 25\nincome = 50000\nif age >= 21 and income >= 40000:\n    print("Eligible for premium credit card")\nelse:\n    print("Not eligible for premium credit card")',
        explanation: 'This checks if both conditions are met: age at least 21 AND income at least 40000. Since both are True for the given values, the person is eligible.',
        output: 'Eligible for premium credit card'
      },
      exercise: {
        instruction: 'Create a program that checks if a number is divisible by both 2 and 3, OR if it\'s greater than 50. Test with the number 42. (Hint: `x % y == 0` checks if x is divisible by y)',
        starterCode: 'number = 42\n# Check the conditions using logical operators',
        expectedOutput: 'True' // 42 is divisible by 2 and 3.
      }
    }
  },
  {
    id: '2-3',
    chapterId: 2,
    title: 'While Loops',
    description: 'Repeat actions until a condition changes',
    difficulty: 3,
    content: {
      introduction: 'While loops let you repeat code as long as a condition remains True. They\'re perfect for situations where you don\'t know in advance how many iterations you\'ll need, or when an action depends on an external state.',
      concept: 'A while loop checks a condition before each iteration. If the condition is True, it executes the loop body; if False, it exits the loop and continues with the rest of the program. It\'s crucial to ensure the condition eventually becomes False to avoid infinite loops.',
      example: {
        code: 'count = 5\nwhile count > 0:\n    print(count)\n    count -= 1  # This line is crucial to eventually make count <= 0\nprint("Blast off!")',
        explanation: 'This creates a countdown from 5 to 1. After each iteration, `count` is decreased by 1. When `count` becomes 0, the condition `count > 0` is False, and the loop exits.',
        output: '5\n4\n3\n2\n1\nBlast off!'
      },
      exercise: {
        instruction: 'Create a while loop that adds numbers starting from 1 (1, then 1+2, then 1+2+3, etc.) until the sum exceeds 50. Print the final sum and how many numbers were added.',
        starterCode: 'current_sum = 0\nnumbers_added = 0\nnext_number = 1\n# Create your while loop here',
        expectedOutput: 'Sum: 55, Count: 10' // 1+2+...+10 = 55
      }
    }
  },
  {
    id: '2-4',
    chapterId: 2,
    title: 'For Loops with Range',
    description: 'Control exactly how your loops iterate',
    difficulty: 2,
    content: {
      introduction: 'The `range()` function gives you precise control over your `for` loops, letting you specify start, stop, and step values for numerical sequences.',
      concept: '`range()` can take up to three arguments: `range(start, stop, step)`.\n- `range(stop)`: Generates numbers from 0 up to (but not including) `stop`.\n- `range(start, stop)`: Generates numbers from `start` up to `stop`.\n- `range(start, stop, step)`: Generates numbers from `start` up to `stop`, incrementing by `step` each time.',
      example: {
        code: '# Count from 1 to 10\nprint("Counting from 1 to 10:")\nfor i in range(1, 11): # stop is 11 to include 10\n    print(i)\n\n# Even numbers from 2 to 10\nprint("\\nEven numbers from 2 to 10:")\nfor i in range(2, 11, 2):\n    print(i)',
        explanation: 'The first loop goes from 1 to 10 (since `range(1, 11)` stops before 11). The second loop starts at 2, goes up to (but not including) 11, and increments by 2 each time, effectively giving even numbers up to 10.',
        output: 'Counting from 1 to 10:\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n\nEven numbers from 2 to 10:\n2\n4\n6\n8\n10'
      },
      exercise: {
        instruction: 'Create a `for` loop that prints the multiples of 3 from 3 up to (and including) 30.',
        starterCode: '# Write your for loop with range() here',
        expectedOutput: '3\n6\n9\n12\n15\n18\n21\n24\n27\n30'
      }
    }
  },
  {
    id: '2-5',
    chapterId: 2,
    title: 'Break and Continue',
    description: 'Control the flow within loops',
    difficulty: 3,
    content: {
      introduction: 'Sometimes you need to exit a loop early or skip certain iterations without terminating the entire loop. The `break` and `continue` statements give you this fine-grained control over loop execution.',
      concept: 'The `break` statement immediately exits the current (innermost) loop. The `continue` statement skips the rest of the code in the current iteration and proceeds to the next iteration of the loop.',
      example: {
        code: '# Using break\nprint("Using break:")\nfor i in range(1, 10):\n    if i == 5:\n        break\n    print(i)\n\n# Using continue\nprint("\\nUsing continue:")\nfor i in range(1, 10):\n    if i % 2 == 0:  # Skip even numbers\n        continue\n    print(i)',
        explanation: 'The first loop prints numbers 1 through 4, then encounters `break` when `i` equals 5 and exits. The second loop skips even numbers (because of `continue`) and only prints odd numbers from 1 to 9.',
        output: 'Using break:\n1\n2\n3\n4\n\nUsing continue:\n1\n3\n5\n7\n9'
      },
      exercise: {
        instruction: 'Create a loop that iterates from 1 to 50. Find the first number that is divisible by 7, print it, and then exit the loop.',
        starterCode: '# Write your loop with a break statement here',
        expectedOutput: '7'
      }
    }
  },
  {
    id: '2-6',
    chapterId: 2,
    title: 'Nested Loops',
    description: 'Loops within loops for complex iterations',
    difficulty: 3,
    content: {
      introduction: 'Nested loops – placing one loop inside another – are powerful tools for working with multi-dimensional data (like grids or tables) or generating complex patterns.',
      concept: 'In a nested loop, the inner loop completes all its iterations for each single iteration of the outer loop. This creates a multiplicative effect on the total number of operations performed.',
      example: {
        code: '# Multiplication table for numbers 1-3\nfor i in range(1, 4):\n    for j in range(1, 4):\n        print(f"{i} × {j} = {i*j}")',
        explanation: 'The outer loop iterates through values 1, 2, and 3 for `i`. For each value of `i`, the inner loop iterates through 1, 2, and 3 for `j`, calculating and printing the product each time.',
        output: '1 × 1 = 1\n1 × 2 = 2\n1 × 3 = 3\n2 × 1 = 2\n2 × 2 = 4\n2 × 3 = 6\n3 × 1 = 3\n3 × 2 = 6\n3 × 3 = 9'
      },
      exercise: {
        instruction: 'Create nested loops to print a simple 3×3 pattern of asterisks, where each row is on a new line.',
        starterCode: '# Write your nested loops here',
        expectedOutput: '***\n***\n***'
      }
    }
  },
  {
    id: '2-7',
    chapterId: 2,
    title: 'Conditional Expressions',
    description: 'Write compact if-else statements in a single line',
    difficulty: 3,
    content: {
      introduction: 'Python offers a compact way to write simple if-else statements in a single line. This is known as a conditional expression or, informally, a ternary operator.',
      concept: 'The syntax is: `value_if_true if condition else value_if_false`. This creates an expression that evaluates to one of two values based on the truthiness of the `condition`. It\'s useful for assignments or simple return values.',
      example: {
        code: 'age = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(f"Status based on age {age}: {status}")\n\n# Compare to regular if-else for clarity\nif age >= 18:\n    status_verbose = "adult"\nelse:\n    status_verbose = "minor"\nprint(f"Verbose status: {status_verbose}")',
        explanation: 'Both approaches achieve the same result of assigning "adult" or "minor" to `status`. The conditional expression is more concise for such simple cases.',
        output: 'Status based on age 20: adult\nVerbose status: adult'
      },
      exercise: {
        instruction: 'Create a conditional expression that sets a variable `message` to "Even" or "Odd" based on whether a given number is divisible by 2. Test with the number 7.',
        starterCode: 'number = 7\n# Write your conditional expression here to set `message`\n# print(message)',
        expectedOutput: 'Odd'
      }
    }
  },
  {
    id: '2-8',
    chapterId: 2,
    title: 'Boolean Logic Deep Dive',
    description: 'Understand truth tables and complex conditions',
    difficulty: 3,
    content: {
      introduction: 'Boolean logic forms the foundation of decision-making in programming. Understanding how logical operators (`and`, `or`, `not`) combine and their order of evaluation is essential for writing correct and complex conditions.',
      concept: 'Boolean expressions evaluate to either `True` or `False`. Complex expressions follow the rules of Boolean algebra. Key truth tables:\n- `A and B`: True only if A and B are both True.\n- `A or B`: True if A is True, or B is True, or both are True.\n- `not A`: True if A is False; False if A is True.\nOperator precedence: `not` is highest, then `and`, then `or`. Parentheses can be used to control evaluation order.',
      example: {
        code: 'a = True\nb = False\nprint(f"a and b: {a and b}")\nprint(f"a or b: {a or b}")\nprint(f"not a: {not a}")\nprint(f"not b: {not b}")\n# Example of XOR (exclusive or): (a or b) and not (a and b)\nprint(f"(a or b) and not (a and b): {(a or b) and not (a and b)}")',
        explanation: 'This demonstrates various combinations of Boolean operators. The last expression shows how to implement an "exclusive or" (XOR) operation, which is true if exactly one of `a` or `b` is true.',
        output: 'a and b: False\na or b: True\nnot a: False\nnot b: True\n(a or b) and not (a and b): True'
      },
      exercise: {
        instruction: 'Create variables `x=True`, `y=False`, `z=True`. Evaluate and print the result of the expression: `(x or y) and (not z or not y)`. Work it out manually first to predict the outcome!',
        starterCode: 'x = True\ny = False\nz = True\n# Evaluate the expression here\n# result = ...\n# print(result)',
        expectedOutput: 'True' // (T or F) and (not T or not F) -> T and (F or T) -> T and T -> True
      }
    }
  },
  {
    id: '2-9',
    chapterId: 2,
    title: 'Match-Case Statements (Python 3.10+)',
    description: 'Use Python\'s modern structural pattern matching',
    difficulty: 4,
    content: {
      introduction: 'Introduced in Python 3.10, the `match-case` statement provides a powerful structural pattern matching feature. It\'s similar to switch statements in other languages but offers more capabilities, including matching based on object structure, types, and values.',
      concept: 'The `match` statement evaluates a subject expression. Its value is then compared against successive patterns specified by `case` clauses. When a pattern matches, the associated code block is executed. The underscore `_` acts as a wildcard, matching anything not caught by previous cases.',
      example: {
        code: 'def describe_value(value):\n    match value:\n        case 0:\n            return "Zero"\n        case int() if value > 0:\n            return "Positive Integer"\n        case int():\n            return "Negative or Zero Integer (re-check logic if 0 is special)"\n        case str() if len(value) < 5:\n            return "Short String"\n        case str():\n            return "Long String"\n        case list() if not value: # Empty list\n            return "Empty List"\n        case list() if len(value) == 1:\n            return "List with one item"\n        case _:\n            return "Something else"\n\nprint(f"0: {describe_value(0)}")\nprint(f"42: {describe_value(42)}")\nprint(f"\'hi\': {describe_value(\'hi\')}")\nprint(f"\'hello_world\': {describe_value(\'hello_world\')}")\nprint(f"[]: {describe_value([])}")\nprint(f"[10]: {describe_value([10])}")\nprint(f"3.14: {describe_value(3.14)}")',
        explanation: 'This function uses `match-case` to describe different types of values. It demonstrates matching literal values, types (with optional guards like `if value > 0`), and using the wildcard `_`. Note: This example assumes Python 3.10+ environment for execution.',
        output: '0: Zero\n42: Positive Integer\n\'hi\': Short String\n\'hello_world\': Long String\n[]: Empty List\n[10]: List with one item\n3.14: Something else'
      },
      exercise: {
        instruction: 'Create a function `handle_command(command)` that takes a command string. Using `match-case`, it should return:\n- "Greeting received" for "hello"\n- "Farewell acknowledged" for "goodbye"\n- "Help is on the way" for "help"\n- "Unknown command" for any other input.\nTest it with "hello", "help", and "status".',
        starterCode: '# Define your function handle_command(command) using match-case here\n# Test calls:\n# print(handle_command("hello"))\n# print(handle_command("help"))\n# print(handle_command("status"))',
        expectedOutput: 'Greeting received\nHelp is on the way\nUnknown command'
      }
    }
  },
  {
    id: '2-10',
    chapterId: 2,
    title: 'Control Flow Mastery Challenge',
    description: 'Solve complex problems using decision and loop structures',
    difficulty: 5,
    content: {
      introduction: 'Now that you\'ve learned various control flow techniques, let\'s combine them to solve more complex problems that require careful logic, iteration, and decision-making. This is where your problem-solving skills truly shine!',
      concept: 'Complex problems often require a combination of multiple control structures: loops (for, while) for iteration over data or repeating processes, conditionals (if-elif-else, match-case) for decision-making at various points, and sometimes early termination or skipping iterations (break, continue) for efficiency or specific logic.',
      example: {
        code: 'def is_prime(n):\n    """Check if a number n is prime."""\n    if n <= 1:\n        return False\n    if n <= 3: # 2 and 3 are prime\n        return True\n    if n % 2 == 0 or n % 3 == 0: # Divisible by 2 or 3 (and not 2 or 3 itself)\n        return False\n    i = 5\n    while i * i <= n: # Only need to check up to sqrt(n)\n        if n % i == 0 or n % (i + 2) == 0:\n            return False\n        i += 6 # Optimization: check i and i+2, then jump 6\n    return True\n\n# Find and print prime numbers up to 20\nprimes_found = []\nfor num in range(1, 21):\n    if is_prime(num):\n        primes_found.append(num)\nprint(f"Prime numbers up to 20: {primes_found}")',
        explanation: 'This example defines an optimized function `is_prime` to check if a number is prime. It uses conditionals for base cases and a `while` loop with specific checks. Then, a `for` loop iterates through numbers, using the `is_prime` function within a conditional to build a list of prime numbers.',
        output: 'Prime numbers up to 20: [2, 3, 5, 7, 11, 13, 17, 19]'
      },
      exercise: {
        instruction: 'Create a program that prints the Fibonacci sequence up to (and including the first number greater than or equal to) 100. The Fibonacci sequence starts 0, 1, and each subsequent number is the sum of the two preceding ones (e.g., 0, 1, 1, 2, 3, 5, 8, ...). Print the sequence as a comma-separated string.',
        starterCode: '# Write your Fibonacci sequence generator here\n# It should print the sequence up to the first number >= 100',
        expectedOutput: '0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144'
      }
    }
  },

  // =======================================================================
  // CHAPTER 3: FUNCTIONS & MODULES
  // =======================================================================
  // This chapter focuses on creating reusable and organized code.
  // Lesson Progression: Starts with basic function definition and calling,
  // explores different parameter types, return values, variable scope (local/global),
  // introduces lambda functions, then moves to using and creating modules.
  // Finishes with advanced topics like decorators and recursion.
  // -----------------------------------------------------------------------
  {
    id: '3-1',
    chapterId: 3,
    title: 'Function Basics: Define and Call',
    description: 'Create and call your own custom functions',
    difficulty: 2,
    content: {
      introduction: 'Functions are the building blocks of reusable code. They let you package a sequence of statements into a logical unit that can be called (executed) whenever needed, potentially multiple times, from different parts of your program.',
      concept: 'A function is defined using the `def` keyword, followed by the function name, parentheses `()` which may contain parameters, and a colon `:`. The indented block of code below the `def` line is the function body. Functions can optionally include a `return` statement to send a value back to the caller.',
      example: {
        code: 'def greet(name):\n    """This function greets the person passed in as a parameter."""\n    message = f"Hello, {name}!"\n    return message\n\n# Call the function\ngreeting_for_alice = greet("Alice")\nprint(greeting_for_alice)\n\n# Call it again with a different argument\nprint(greet("Bob"))',
        explanation: 'We define a function called `greet` that takes one parameter (`name`) and returns a formatted greeting string. We then call this function twice, once storing the result in a variable and printing it, and once printing the result directly.',
        output: 'Hello, Alice!\nHello, Bob!'
      },
      exercise: {
        instruction: 'Create a function called `square` that takes one number as a parameter and returns its square (the number multiplied by itself). Test it by calling the function with the number 7 and printing the result.',
        starterCode: '# Define your function `square` here\n\n# Test it with 7 and print the result\n# result = ...\n# print(result)',
        expectedOutput: '49'
      }
    }
  },
  {
    id: '3-2',
    chapterId: 3,
    title: 'Function Parameters and Arguments',
    description: 'Learn different ways to pass data to functions',
    difficulty: 3,
    content: {
      introduction: 'Python offers several ways to define function parameters and pass arguments, giving you flexibility in how data is provided to your functions. Understanding these variations is key to writing versatile functions.',
      concept: 'Functions can have:\n- **Positional parameters**: Required arguments passed in order.\n- **Default parameter values**: Parameters that take a default value if no argument is supplied for them.\n- **Keyword arguments**: Arguments passed using `parameter_name=value` syntax, allowing them to be out of order.\n- **Variable-length arguments**: `*args` (for non-keyworded variable number of arguments) and `**kwargs` (for keyworded variable number of arguments).',
      example: {
        code: '# Function with default parameter value\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))  # Uses default greeting\nprint(greet("Bob", "Hi"))  # Overrides default greeting\n\n# Calling with keyword arguments\nprint(greet(greeting="Howdy", name="Charlie"))  # Order doesn\'t matter\nprint(greet(name="Diana")) # Can use keyword for one, default for other\n\n# Function with *args\ndef print_all(*items):\n    for item in items:\n        print(item)\nprint_all("apple", "banana", 123)',
        explanation: 'The `greet` function has a default value for `greeting`. We demonstrate calling it with and without overriding the default, and using keyword arguments. The `print_all` function uses `*args` to accept any number of positional arguments, which are then available as a tuple named `items` inside the function.',
        output: 'Hello, Alice!\nHi, Bob!\nHowdy, Charlie!\nHello, Diana!\napple\nbanana\n123'
      },
      exercise: {
        instruction: 'Create a function `calculate_total` that takes a `price` (required) and an optional `tax_rate` (defaulting to 0.1, i.e., 10%). The function should return the price plus tax. Test it by calling it with `price=100` (using default tax) and with `price=100, tax_rate=0.05`.',
        starterCode: '# Define your function `calculate_total` here\n\n# Test calls\n# total1 = ...\n# total2 = ...\n# print(f"Total 1: {total1}")\n# print(f"Total 2: {total2}")',
        expectedOutput: 'Total 1: 110.0\nTotal 2: 105.0'
      }
    }
  },
  {
    id: '3-3',
    chapterId: 3,
    title: 'Return Values from Functions',
    description: 'Send data back from your functions to the caller',
    difficulty: 2,
    content: {
      introduction: 'Functions often compute a result or find some information. The `return` statement allows a function to send data (its result) back to the part of the code that called it.',
      concept: 'The `return` statement immediately exits the function and passes the specified value (or values) back to the caller. A function can return any type of Python object: numbers, strings, lists, dictionaries, other functions, etc. If a function doesn\'t have an explicit `return` statement, or has a `return` statement without a value, it implicitly returns `None`. A function can also return multiple values, which are packed into a tuple.',
      example: {
        code: 'def divide(a, b):\n    if b == 0:\n        print("Error: Division by zero!")\n        return None # Explicitly return None on error\n    return a / b\n\nresult1 = divide(10, 2)\nresult2 = divide(10, 0)\n\nprint(f"10 / 2 = {result1}")\nprint(f"10 / 0 = {result2}")\n\n# Function returning multiple values (as a tuple)\ndef get_coordinates():\n    return 10, 20 # Returns the tuple (10, 20)\n\nx, y = get_coordinates() # Unpacking the returned tuple\nprint(f"Coordinates: x={x}, y={y}")',
        explanation: 'The `divide` function returns the result of division or `None` if division by zero occurs. The `get_coordinates` function returns two values, which are automatically packed into a tuple. The caller can then unpack this tuple into separate variables.',
        output: '10 / 2 = 5.0\nError: Division by zero!\n10 / 0 = None\nCoordinates: x=10, y=20'
      },
      exercise: {
        instruction: 'Create a function `get_min_max(numbers)` that takes a list of numbers and returns both the minimum and maximum numbers in that list. Test it with the list `[5, 3, 8, 1, 7]` and print the results.',
        starterCode: '# Define your function `get_min_max` here\n\n# Test it\n# data = [5, 3, 8, 1, 7]\n# min_val, max_val = ...\n# print(f"Minimum: {min_val}, Maximum: {max_val}")',
        expectedOutput: 'Minimum: 1, Maximum: 8'
      }
    }
  },
  {
    id: '3-4',
    chapterId: 3,
    title: 'Variable Scope (LEGB Rule)',
    description: 'Understand where variables are accessible in your code',
    difficulty: 3,
    content: {
      introduction: 'Variable scope determines the accessibility of a variable in different parts of your code. Understanding Python\'s scope rules (often summarized by the LEGB rule: Local, Enclosing function locals, Global, Built-in) is crucial for avoiding bugs and writing functions that interact correctly with their environment.',
      concept: '- **Local scope**: Variables defined inside a function are local to that function and cannot be accessed outside it.\n- **Global scope**: Variables defined at the top level of a script or module are global.\n- To modify a global variable from inside a function, you must use the `global` keyword.\n- If a variable is assigned a value anywhere within the function’s body, it’s assumed to be a local unless explicitly declared as global.',
      example: {
        code: 'global_var = 100 # Global variable\n\ndef my_function():\n    local_var = 10 # Local variable\n    print(f"Inside function: local_var = {local_var}")\n    print(f"Inside function: global_var (accessed) = {global_var}")\n\ndef modify_global():\n    global global_var # Declare intent to modify global_var\n    global_var = 200\n    print(f"Inside modify_global: global_var (modified) = {global_var}")\n\nmy_function()\nmodify_global()\nprint(f"Outside function: global_var = {global_var}")\n# print(local_var) # This would cause a NameError because local_var is not defined globally',
        explanation: '`global_var` is accessible inside `my_function` for reading. To change its value, `modify_global` uses the `global` keyword. `local_var` is only known within `my_function`. Attempting to access `local_var` outside `my_function` would result in an error.',
        output: 'Inside function: local_var = 10\nInside function: global_var (accessed) = 100\nInside modify_global: global_var (modified) = 200\nOutside function: global_var = 200'
      },
      exercise: {
        instruction: 'Initialize a global variable `total_score` to 0. Create a function `add_points(points)` that adds the given `points` to `total_score`. Call this function three times with different point values (e.g., 10, 20, 5) and then print the final `total_score`.',
        starterCode: 'total_score = 0 # Global variable\n\n# Define your function `add_points` here\n\n# Call the function multiple times\n\n# Print the final total_score',
        expectedOutput: 'Final total_score: 35' // Assuming calls with 10, 20, 5
      }
    }
  },
  {
    id: '3-5',
    chapterId: 3,
    title: 'Lambda Functions (Anonymous Functions)',
    description: 'Create small, single-expression anonymous functions',
    difficulty: 3,
    content: {
      introduction: 'Lambda functions, also known as anonymous functions, are small, restricted functions that are not bound to a name (i.e., they don\'t need `def`). They are useful for short, simple operations where a full function definition would be overly verbose, often used with functions like `map()`, `filter()`, or as arguments to other functions.',
      concept: 'A lambda function is defined using the `lambda` keyword. It can take any number of arguments but can only have one expression. The expression is evaluated and its result is returned when the lambda function is called. Syntax: `lambda arguments: expression`',
      example: {
        code: '# Regular function for squaring\ndef square_def(x):\n    return x * x\n\n# Equivalent lambda function\nsquare_lambda = lambda x: x * x\n\nprint(f"Using def: square(5) = {square_def(5)}")\nprint(f"Using lambda: square_lambda(5) = {square_lambda(5)}")\n\n# Lambda with multiple arguments\nsum_lambda = lambda x, y: x + y\nprint(f"sum_lambda(3, 4) = {sum_lambda(3, 4)}")\n\n# Using lambda with sorting (e.g., sort a list of tuples by the second element)\npoints = [(1, 5), (3, 2), (2, 8)]\npoints.sort(key=lambda point: point[1]) # Sort by the y-coordinate\nprint(f"Sorted points by y-coordinate: {points}")',
        explanation: 'We define and use lambda functions for simple operations like squaring and summing. In the last example, a lambda function is used as the `key` for the `sort` method to specify custom sorting logic (sorting by the second element of each tuple).',
        output: 'Using def: square(5) = 25\nUsing lambda: square_lambda(5) = 25\nsum_lambda(3, 4) = 7\nSorted points by y-coordinate: [(3, 2), (1, 5), (2, 8)]'
      },
      exercise: {
        instruction: 'You have a list of strings: `words = ["apple", "banana", "cherry", "date"]`. Use the `filter()` function along with a lambda function to create a new list containing only the words that have more than 5 characters.',
        starterCode: 'words = ["apple", "banana", "cherry", "date"]\n# Use filter() with a lambda function here\n# long_words = ...\n# print(list(long_words))', // filter returns an iterator, so convert to list for printing
        expectedOutput: "['banana', 'cherry']"
      }
    }
  },
  {
    id: '3-6',
    chapterId: 3,
    title: 'Modules and the Import Statement',
    description: 'Use code from Python\'s standard library and other files',
    difficulty: 2,
    content: {
      introduction: 'Modules are Python files (`.py`) containing definitions and statements (functions, classes, variables) that you can use in other Python programs. Python comes with a rich standard library of modules for common tasks, and you can create your own.',
      concept: 'You bring the functionality of a module into your current program using the `import` statement. There are several ways to import:\n- `import module_name`: Imports the entire module. Access items via `module_name.item`.\n- `from module_name import item1, item2`: Imports specific items directly into the current namespace.\n- `from module_name import *`: Imports all items (generally discouraged for clarity).\n- `import module_name as alias`: Imports a module under a different name (alias).',
      example: {
        code: '# Import entire module\nimport math\nprint(f"Square root of 16: {math.sqrt(16)}")\nprint(f"Value of pi: {math.pi}")\n\n# Import specific functions from a module\nfrom random import randint, choice\nprint(f"Random integer (1-10): {randint(1, 10)}")\nprint(f"Random choice from list: {choice([\'apple\', \'banana\', \'cherry\'])}")\n\n# Import a module with an alias\nimport datetime as dt\ncurrent_time = dt.datetime.now()\nprint(f"Current date: {current_time.strftime(\'%Y-%m-%d\')}")',
        explanation: 'We demonstrate importing and using functions and constants from the `math`, `random`,and `datetime` modules from Python\'s standard library. The `as` keyword is used to create a shorter alias for `datetime`.',
        output: 'Square root of 16: 4.0\nValue of pi: 3.141592653589793\nRandom integer (1-10): [A random integer between 1 and 10]\nRandom choice from list: [A random fruit from the list]\nCurrent date: [Current date in YYYY-MM-DD format]'
      },
      exercise: {
        instruction: 'Import the `statistics` module from Python\'s standard library. Given the list of numbers `data = [4, 2, 7, 5, 5, 6, 8, 9, 4]`, use functions from the `statistics` module to calculate and print its mean, median, and mode.',
        starterCode: '# Import the statistics module here\n\ndata = [4, 2, 7, 5, 5, 6, 8, 9, 4]\n# Calculate and print mean, median, and mode\n# mean_val = ...\n# median_val = ...\n# mode_val = ...\n# print(f"Mean: {mean_val}, Median: {median_val}, Mode: {mode_val}")',
        expectedOutput: 'Mean: 5.555..., Median: 5, Mode: 4' // Actual mean is 50/9
      }
    }
  },
  {
    id: '3-7',
    chapterId: 3,
    title: 'Creating Your Own Modules',
    description: 'Organize your code into reusable custom modules',
    difficulty: 4,
    content: {
      introduction: 'As your programs grow in size and complexity, organizing your code into separate modules becomes essential for maintainability and reusability. You can create your own modules to group related functions, classes, and variables.',
      concept: 'A module in Python is simply a `.py` file. Any Python file can be a module. You can import from your own modules just like you import from the standard library, provided the module file is in a location Python can find (e.g., the same directory, or a directory in `sys.path`).',
      example: {
        code: '// Imagine this code is in a file named "my_utils.py"\n// File: my_utils.py\n// def count_words(text):\n//     return len(text.split())\n// \n// def reverse_string(text):\n//     return text[::-1]\n\n// Now, in your main program file (e.g., main.py), you would do:\n// import my_utils\n// \n// sample_text = "Python is fun and powerful"\n// word_count = my_utils.count_words(sample_text)\n// reversed_text = my_utils.reverse_string("Hello")\n// \n// print(f"Word count in \'{sample_text}\': {word_count}")\n// print(f"\'Hello\' reversed: {reversed_text}")\n\n// For this example, we simulate the output as if it ran:\nprint("Word count in \'Python is fun and powerful\': 5")\nprint("\'Hello\' reversed: olleH")',
        explanation: 'We first conceptualize a module `my_utils.py` with two utility functions. Then, we show how a main program (`main.py`) would import and use these functions. This separation helps organize code and makes the utility functions reusable across different parts of a larger project or even in different projects.',
        output: 'Word count in \'Python is fun and powerful\': 5\n\'Hello\' reversed: olleH'
      },
      exercise: {
        instruction: '1. Describe the content of a Python file named `geometry_calculator.py` that contains two functions: `circle_area(radius)` and `rectangle_area(length, width)`.\n2. Show how you would import and use these functions in another Python script to calculate the area of a circle with radius 5 and a rectangle with length 4 and width 6. Print both results.',
        starterCode: '// Step 1: Describe geometry_calculator.py content (as comments)\n\n// Step 2: Show import and usage in another script (as comments or simulated print)\n// print("Simulated output:")\n// print(f"Area of circle (radius 5): {78.539...}") \n// print(f"Area of rectangle (4x6): {24.0}")',
        expectedOutput: 'Simulated output:\nArea of circle (radius 5): 78.53981633974483\nArea of rectangle (4x6): 24.0'
      }
    }
  },
  {
    id: '3-8',
    chapterId: 3,
    title: 'Function Decorators',
    description: 'Modify or enhance functions with elegant wrappers',
    difficulty: 4,
    content: {
      introduction: 'Decorators are a powerful and expressive feature in Python that allow you to modify or enhance functions or methods in a clean, readable way. They are a form of metaprogramming, where part of the program tries to modify another part of the program at compile time. Common uses include logging, timing function execution, access control, and instrumentation.',
      concept: 'A decorator is essentially a function that takes another function (the decorated function) as an argument, adds some functionality to it (without explicitly modifying the original function\'s code), and returns the modified (decorated) function. The `@decorator_name` syntax placed above a function definition is syntactic sugar for applying the decorator.',
      example: {
        code: 'import time\n\ndef timer_decorator(func):\n    """A decorator that prints the execution time of the decorated function."""\n    def wrapper_function(*args, **kwargs):\n        start_time = time.time()\n        result = func(*args, **kwargs) # Call the original function\n        end_time = time.time()\n        print(f"Function \'{func.__name__}\' took {end_time - start_time:.4f} seconds to execute.")\n        return result\n    return wrapper_function\n\n@timer_decorator\ndef slow_function(delay_seconds):\n    """A function that simulates a slow operation."""\n    print(f"slow_function called with delay: {delay_seconds}")\n    time.sleep(delay_seconds)\n    return "Operation complete!"\n\nresult_message = slow_function(1) # Call the decorated function\nprint(result_message)',
        explanation: 'We define `timer_decorator` which takes a function `func` as input. It defines an inner `wrapper_function` that records time, calls `func`, records time again, prints the duration, and returns `func`\'s result. The `@timer_decorator` syntax applies this to `slow_function`. When `slow_function(1)` is called, it\'s actually `wrapper_function(1)` that executes.',
        output: 'slow_function called with delay: 1\nFunction \'slow_function\' took 1.00xx seconds to execute.\nOperation complete!' // xx will vary slightly
      },
      exercise: {
        instruction: 'Create a decorator called `debug_args` that prints the function name, its positional arguments (`*args`), and its keyword arguments (`**kwargs`) before calling the actual function. Apply this decorator to a simple function, for example, one that adds two numbers, and call the decorated function with both positional and keyword arguments.',
        starterCode: '# Define your `debug_args` decorator here\n\n# Define a simple function and decorate it\n# @debug_args\n# def add_numbers(a, b, c=0):\n#     return a + b + c\n\n# Call the decorated function\n# print(f"Result: {add_numbers(3, 4, c=5)}")\n# print(f"Result: {add_numbers(10, 20)}")',
        expectedOutput: 'Calling add_numbers with args=(3, 4), kwargs={\'c\': 5}\nResult: 12\nCalling add_numbers with args=(10, 20), kwargs={}\nResult: 30'
      }
    }
  },
  {
    id: '3-9',
    chapterId: 3,
    title: 'Recursion: Functions Calling Themselves',
    description: 'Write elegant solutions for problems with recursive structures',
    difficulty: 4,
    content: {
      introduction: 'Recursion is a powerful programming technique where a function calls itself to solve smaller instances of the same problem. It\'s particularly well-suited for problems that can be broken down into self-similar subproblems, such as tree traversals, certain mathematical calculations (like factorials or Fibonacci numbers), and some sorting algorithms.',
      concept: 'A recursive function must have two key components:\n1. **Base Case(s)**: One or more conditions that provide a direct, non-recursive answer for the simplest inputs, stopping the recursion.\n2. **Recursive Step**: The part of the function where it calls itself with modified arguments, moving closer to a base case.',
      example: {
        code: 'def factorial(n):\n    """Calculate the factorial of n using recursion (n!)."""\n    # Base case: factorial of 0 or 1 is 1\n    if n == 0 or n == 1:\n        return 1\n    # Recursive step: n * factorial of (n-1)\n    else:\n        return n * factorial(n - 1)\n\nprint(f"Factorial of 5: {factorial(5)}") # 5! = 5 * 4 * 3 * 2 * 1 = 120\n\ndef fibonacci(n):\n    """Calculate the nth Fibonacci number using recursion."""\n    if n <= 0:\n        return 0 # Or raise an error for invalid input\n    elif n == 1:\n        return 0 # Sequence: 0, 1, 1, 2, 3... (F0=0, F1=1)\n    elif n == 2:\n        return 1\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(f"7th Fibonacci number (F7): {fibonacci(7)}") # F1=0, F2=1, F3=1, F4=2, F5=3, F6=5, F7=8',
        explanation: 'We implement two classic recursive algorithms: `factorial` and `fibonacci`. Each has clearly defined base cases to stop the recursion and a recursive step that breaks the problem down. Note: The recursive Fibonacci shown is inefficient for large `n` due to re-computation, but illustrates the concept well.',
        output: 'Factorial of 5: 120\n7th Fibonacci number (F7): 8'
      },
      exercise: {
        instruction: 'Write a recursive function `sum_digits(n)` that calculates the sum of the digits in a non-negative integer `n`. For example, `sum_digits(123)` should return `1 + 2 + 3 = 6`. (Hint: `n % 10` gives the last digit, `n // 10` removes the last digit).',
        starterCode: '# Define your recursive function `sum_digits(n)` here\n\n# Test cases\n# print(f"Sum of digits in 123: {sum_digits(123)}")\n# print(f"Sum of digits in 9876: {sum_digits(9876)}")\n# print(f"Sum of digits in 0: {sum_digits(0)}")',
        expectedOutput: 'Sum of digits in 123: 6\nSum of digits in 9876: 30\nSum of digits in 0: 0'
      }
    }
  },
  {
    id: '3-10',
    chapterId: 3,
    title: 'Functional Programming Tools: Map, Filter, Reduce',
    description: 'Use map, filter, and reduce for powerful data processing',
    difficulty: 4,
    content: {
      introduction: 'Python supports several functional programming paradigms that allow you to process data in a more declarative style. Built-in functions like `map()`, `filter()`, and `functools.reduce()` enable concise and powerful data transformations on iterables.',
      concept: 'Functional programming emphasizes applying functions to data, often avoiding explicit loops and mutable state.\n- **`map(function, iterable)`**: Applies `function` to every item of `iterable` and returns an iterator of the results.\n- **`filter(function, iterable)`**: Constructs an iterator from elements of `iterable` for which `function` returns true.\n- **`functools.reduce(function, iterable[, initializer])`**: Applies `function` of two arguments cumulatively to the items of `iterable`, from left to right, so as to reduce the iterable to a single value.',
      example: {
        code: 'from functools import reduce # reduce is in functools module\n\nnumbers = [1, 2, 3, 4, 5]\n\n# Map: Apply a function (e.g., square) to each item\nsquared_numbers = list(map(lambda x: x**2, numbers))\nprint(f"Original numbers: {numbers}")\nprint(f"Squared numbers (map): {squared_numbers}")\n\n# Filter: Keep only items that satisfy a condition (e.g., even numbers)\neven_numbers = list(filter(lambda x: x % 2 == 0, numbers))\nprint(f"Even numbers (filter): {even_numbers}")\n\n# Reduce: Aggregate items using a function (e.g., sum all numbers)\nsum_of_all = reduce(lambda x, y: x + y, numbers)\nproduct_of_all = reduce(lambda x, y: x * y, numbers, 1) # Initializer 1 for product\nprint(f"Sum of all (reduce): {sum_of_all}")\nprint(f"Product of all (reduce): {product_of_all}")',
        explanation: 'We use `map()` to square each number in a list, `filter()` to select only the even numbers, and `reduce()` to calculate both the sum and product of all numbers. These functions often lead to more compact and readable code for data transformations compared to explicit loops.',
        output: 'Original numbers: [1, 2, 3, 4, 5]\nSquared numbers (map): [1, 4, 9, 16, 25]\nEven numbers (filter): [2, 4]\nSum of all (reduce): 15\nProduct of all (reduce): 120'
      },
      exercise: {
        instruction: 'Given a list of numbers: `data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`. Use a combination of `filter()`, `map()`, and `reduce()` (or `sum()`) to find the sum of the squares of only the even numbers in this list.',
        starterCode: 'from functools import reduce\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# 1. Filter for even numbers\n# 2. Map to get their squares\n# 3. Reduce (or sum) to get the total sum\n# result = ...\n# print(f"Sum of squares of even numbers: {result}")',
        expectedOutput: 'Sum of squares of even numbers: 220' // Even numbers: 2,4,6,8,10. Squares: 4,16,36,64,100. Sum: 220.
      }
    }
  },

  // =======================================================================
  // CHAPTER 4: DATA STRUCTURES
  // =======================================================================
  // This chapter explores Python's built-in and specialized data structures.
  // Lesson Progression: In-depth coverage of lists, dictionaries, tuples, and sets.
  // Then moves to advanced comprehensions, nested structures, named tuples/data classes,
  // the `collections` module, and working with JSON data.
  // -----------------------------------------------------------------------
  {
    id: '4-1',
    chapterId: 4,
    title: 'Lists In-Depth: Methods and Operations',
    description: 'Master Python\'s versatile list data structure and its methods',
    difficulty: 2,
    content: {
      introduction: 'Lists are one of Python\'s most fundamental and versatile data structures. They are ordered, mutable (changeable) collections of items, which can be of different types. This lesson explores common list methods and operations beyond basic creation and indexing.',
      concept: 'Lists support a wide range of methods for manipulation: `append()`, `extend()`, `insert()`, `remove()`, `pop()`, `clear()`, `index()`, `count()`, `sort()`, `reverse()`. They also support slicing for sublist extraction and modification, and operators like `+` (concatenation) and `*` (repetition).',
      example: {
        code: '# Creating and accessing lists\nfruits = ["apple", "banana", "cherry", "date"]\nprint(f"Original fruits: {fruits}")\nprint(f"First item: {fruits[0]}, Last item: {fruits[-1]}")\n\n# Slicing\nprint(f"Slice (items 1-2): {fruits[1:3]}") # items at index 1 and 2\n\n# List methods\nfruits.append("elderberry")  # Add to end\nprint(f"After append: {fruits}")\nfruits.insert(2, "blueberry")  # Insert "blueberry" at index 2\nprint(f"After insert: {fruits}")\nfruits.remove("banana")  # Remove first occurrence of "banana"\nprint(f"After remove: {fruits}")\npopped_item = fruits.pop()  # Remove and return last item\nprint(f"Popped item: {popped_item}, List after pop: {fruits}")\n\n# Sorting\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nnumbers.sort()  # In-place sort (modifies original list)\nprint(f"Sorted numbers: {numbers}")\n# sorted() function returns a new sorted list without modifying original\noriginal_numbers = [3, 1, 4]\nsorted_copy = sorted(original_numbers)\nprint(f"Original: {original_numbers}, Sorted copy: {sorted_copy}")\n\n# List comprehension (recap)\nsquares = [x**2 for x in range(1, 6)]\nprint(f"Squares (comprehension): {squares}")',
        explanation: 'We demonstrate various list operations: creating, accessing elements by index, slicing to get sublists, common list methods like `append`, `insert`, `remove`, `pop`, and `sort`. We also differentiate between in-place sorting with `.sort()` and creating a sorted copy with `sorted()`. List comprehensions are briefly recapped.',
        output: 'Original fruits: [\'apple\', \'banana\', \'cherry\', \'date\']\nFirst item: apple, Last item: date\nSlice (items 1-2): [\'banana\', \'cherry\']\nAfter append: [\'apple\', \'banana\', \'cherry\', \'date\', \'elderberry\']\nAfter insert: [\'apple\', \'banana\', \'blueberry\', \'cherry\', \'date\', \'elderberry\']\nAfter remove: [\'apple\', \'blueberry\', \'cherry\', \'date\', \'elderberry\']\nPopped item: elderberry, List after pop: [\'apple\', \'blueberry\', \'cherry\', \'date\']\nSorted numbers: [1, 1, 2, 3, 4, 5, 6, 9]\nOriginal: [3, 1, 4], Sorted copy: [1, 3, 4]\nSquares (comprehension): [1, 4, 9, 16, 25]'
      },
      exercise: {
        instruction: 'Start with the list `my_list = [10, 20, 30, 40, 50]`.\n1. Append the number 60 to `my_list`.\n2. Insert the number 25 at index 2.\n3. Remove the number 30 from the list.\n4. Reverse the list in-place.\nPrint the list after each step and the final list.',
        starterCode: 'my_list = [10, 20, 30, 40, 50]\nprint(f"Initial list: {my_list}")\n\n# Step 1: Append 60\n\n# Step 2: Insert 25 at index 2\n\n# Step 3: Remove 30\n\n# Step 4: Reverse the list\n\n# print(f"Final list: {my_list}")',
        expectedOutput: 'Initial list: [10, 20, 30, 40, 50]\nAfter append: [10, 20, 30, 40, 50, 60]\nAfter insert: [10, 20, 25, 30, 40, 50, 60]\nAfter remove: [10, 20, 25, 40, 50, 60]\nFinal list: [60, 50, 40, 25, 20, 10]'
      }
    }
  },
  {
    id: '4-2',
    chapterId: 4,
    title: 'Dictionaries: Key-Value Stores',
    description: 'Store and retrieve data efficiently using key-value pairs',
    difficulty: 3,
    content: {
      introduction: 'Dictionaries are Python\'s built-in mapping type, allowing you to store data as collections of key-value pairs. They are incredibly useful for representing structured data and provide fast lookups, insertions, and deletions based on keys.',
      concept: 'A dictionary maps unique, immutable keys (like strings, numbers, or tuples) to values (which can be any Python object). Dictionaries are unordered (prior to Python 3.7, though insertion order is remembered in CPython 3.6+ and guaranteed in Python 3.7+). They are created with curly braces `{}` or the `dict()` constructor.',
      example: {
        code: '# Creating dictionaries\nstudent = {\n    "name": "Alice",\n    "age": 22,\n    "courses": ["Math", "Computer Science", "Physics"],\n    "is_graduated": False\n}\nprint(f"Student data: {student}")\n\n# Accessing values\nprint(f"Name: {student[\'name\']}") # Access via key\nprint(f"Age using .get(): {student.get(\'age\')}")  # Safe access with .get()\nprint(f"Grade (with default): {student.get(\'grade\', \'N/A\')}") # .get() can provide a default if key is missing\n\n# Modifying dictionaries\nstudent["age"] = 23  # Update value for an existing key\nstudent["major"] = "Computer Science"  # Add a new key-value pair\nprint(f"Updated student: {student}")\ndel student["is_graduated"]  # Remove a key-value pair\nprint(f"After deleting \'is_graduated\': {student}")\n\n# Dictionary methods\nprint(f"Keys: {list(student.keys())}")\nprint(f"Values: {list(student.values())}")\nprint(f"Items (key-value pairs): {list(student.items())}")\n\n# Dictionary comprehension\nsquares_dict = {x: x**2 for x in range(1, 6)}\nprint(f"Squares dictionary: {squares_dict}")',
        explanation: 'We demonstrate creating a dictionary, accessing its values using keys (both directly and with the safer `.get()` method), modifying it by updating existing keys or adding new ones, and deleting entries. Common dictionary methods like `.keys()`, `.values()`, and `.items()` are shown, along with a dictionary comprehension example.',
        output: 'Student data: {\'name\': \'Alice\', \'age\': 22, \'courses\': [\'Math\', \'Computer Science\', \'Physics\'], \'is_graduated\': False}\nName: Alice\nAge using .get(): 22\nGrade (with default): N/A\nUpdated student: {\'name\': \'Alice\', \'age\': 23, \'courses\': [\'Math\', \'Computer Science\', \'Physics\'], \'is_graduated\': False, \'major\': \'Computer Science\'}\nAfter deleting \'is_graduated\': {\'name\': \'Alice\', \'age\': 23, \'courses\': [\'Math\', \'Computer Science\', \'Physics\'], \'major\': \'Computer Science\'}\nKeys: [\'name\', \'age\', \'courses\', \'major\']\nValues: [\'Alice\', 23, [\'Math\', \'Computer Science\', \'Physics\'], \'Computer Science\']\nItems (key-value pairs): [(\'name\', \'Alice\'), (\'age\', 23), (\'courses\', [\'Math\', \'Computer Science\', \'Physics\']), (\'major\', \'Computer Science\')]\nSquares dictionary: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}'
      },
      exercise: {
        instruction: 'Create a dictionary that maps the names of at least 5 countries to their respective capitals (e.g., "France": "Paris"). Then, write code that prompts the user to enter a country name and prints its capital, or a message if the country is not in your dictionary.',
        starterCode: '# Create your country-capital dictionary here\ncapitals = {}\n\n# Get input from the user\n# country_name = input("Enter a country name: ")\n\n# Check if the country is in the dictionary and print the capital or a message\n# For testing, simulate input:\ncountry_name = "Germany" # Test with a country in your dict\n# country_name = "Brazil" # Test with a country NOT in your dict (if applicable)\n\n# if country_name in capitals:\n#     print(f"The capital of {country_name} is {capitals[country_name]}.")\n# else:\n#     print(f"Sorry, the capital of {country_name} is not in our records.")',
        expectedOutput: 'The capital of Germany is Berlin.' // (Assuming Germany: Berlin is in the dict)
      }
    }
  },
  {
    id: '4-3',
    chapterId: 4,
    title: 'Tuples: Immutable Sequences',
    description: 'Use immutable sequences for fixed collections of data',
    difficulty: 2,
    content: {
      introduction: 'Tuples are ordered, immutable (unchangeable) sequences, similar to lists. Because they cannot be modified after creation, they are often used to represent fixed collections of items, like coordinates, database records, or items that should not be altered.',
      concept: 'Tuples are created using parentheses `()` or by separating items with commas. A single-item tuple requires a trailing comma (e.g., `(42,)`). Since they are immutable, tuples are more memory-efficient than lists for fixed data and can be used as keys in dictionaries or elements in sets (as long as all their items are also immutable).',
      example: {
        code: '# Creating tuples\npoint_2d = (3, 4)  # Tuple with parentheses\nrgb_color = 255, 128, 0  # Tuple without parentheses (comma-separated)\nsingle_element_tuple = ("hello",)  # Note the trailing comma for a single-item tuple\nempty_tuple = ()\n\nprint(f"2D Point: {point_2d}")\nprint(f"RGB Color: {rgb_color}")\nprint(f"Single element tuple: {single_element_tuple}")\n\n# Accessing tuple elements (like lists)\nprint(f"X-coordinate: {point_2d[0]}, Y-coordinate: {point_2d[1]}")\n\n# Unpacking a tuple\nx, y = point_2d\nprint(f"Unpacked: x={x}, y={y}")\n\n# Tuple methods (fewer than lists due to immutability)\ntuple_with_duplicates = (1, 2, 2, 3, 4, 2, 2)\nprint(f"Count of 2s: {tuple_with_duplicates.count(2)}")\nprint(f"Index of first occurrence of 3: {tuple_with_duplicates.index(3)}")\n\n# Immutability demonstration\ntry:\n    point_2d[0] = 10  # This will raise a TypeError\nexcept TypeError as e:\n    print(f"Error when trying to modify tuple: {e}")\n\n# Using tuples as dictionary keys (because they are hashable)\nlocations = {\n    (40.7128, -74.0060): "New York City",\n    (34.0522, -118.2437): "Los Angeles"\n}\nprint(f"City at (40.7128, -74.0060): {locations[(40.7128, -74.0060)]}")',
        explanation: 'We demonstrate various ways to create tuples, including single-element tuples. Accessing elements and unpacking tuples are shown. We highlight tuple methods like `.count()` and `.index()`. The immutability of tuples is proven by attempting modification, which raises a `TypeError`. Finally, their use as dictionary keys is illustrated.',
        output: '2D Point: (3, 4)\nRGB Color: (255, 128, 0)\nSingle element tuple: (\'hello\',)\nX-coordinate: 3, Y-coordinate: 4\nUnpacked: x=3, y=4\nCount of 2s: 4\nIndex of first occurrence of 3: 3\nError when trying to modify tuple: \'tuple\' object does not support item assignment\nCity at (40.7128, -74.006): New York City'
      },
      exercise: {
        instruction: 'Create a list of tuples, where each tuple contains a student\'s name (string) and their exam score (integer). For example: `[("Alice", 92), ("Bob", 88), ("Charlie", 95)]`. Then, write code to iterate through this list and print the name of the student who has the highest score.',
        starterCode: 'student_scores = [("Alice", 92), ("Bob", 88), ("Charlie", 95), ("Diana", 90)]\n\n# Find the student with the highest score\n# highest_score = -1\n# top_student_name = ""\n# for name, score in student_scores:\n#     ...\n# print(f"The student with the highest score is {top_student_name} with {highest_score}.")',
        expectedOutput: 'The student with the highest score is Charlie with 95.'
      }
    }
  },
  {
    id: '4-4',
    chapterId: 4,
    title: 'Sets: Unordered Collections of Unique Elements',
    description: 'Work with unordered collections of unique elements and perform set operations',
    difficulty: 3,
    content: {
      introduction: 'Sets are unordered collections of unique, immutable elements. They are highly optimized for membership testing (checking if an element is present), removing duplicates from a sequence, and performing mathematical set operations like union, intersection, difference, and symmetric difference.',
      concept: 'Sets are created using curly braces `{}` (e.g., `{1, 2, 3}`) or the `set()` constructor (e.g., `set([1, 2, 2, 3])`). They do not maintain any specific order of elements and automatically discard duplicates. Elements in a set must be immutable (e.g., numbers, strings, tuples).',
      example: {
        code: '# Creating sets\nset_from_list = set([1, 2, 2, 3, 1, 4]) # Duplicates are removed\nprint(f"Set from list: {set_from_list}")\nliteral_set = {"apple", "banana", "cherry", "apple"} # Duplicates removed\nprint(f"Literal set: {literal_set}") # Note: order is not guaranteed\nempty_set = set() # Must use set() for an empty set, {} creates an empty dict\n\n# Set operations\nset_a = {1, 2, 3, 4, 5}\nset_b = {4, 5, 6, 7, 8}\n\nprint(f"Set A: {set_a}, Set B: {set_b}")\nprint(f"Union (A | B): {set_a | set_b}")  # All unique elements from both sets\nprint(f"Intersection (A & B): {set_a & set_b}")  # Elements common to both sets\nprint(f"Difference (A - B): {set_a - set_b}")  # Elements in A but not in B\nprint(f"Symmetric Difference (A ^ B): {set_a ^ set_b}")  # Elements in A or B, but not in both\n\n# Set methods\ncolors = {"red", "green", "blue"}\ncolors.add("yellow")  # Add a single element\nprint(f"After adding yellow: {colors}")\ncolors.update(["orange", "purple", "red"])  # Add multiple elements (duplicates ignored)\nprint(f"After update: {colors}")\ncolors.remove("green")  # Remove "green" (raises KeyError if not found)\ncolors.discard("black")  # Remove "black" if present (no error if not found)\nprint(f"After remove/discard: {colors}")\n\n# Membership testing (very efficient)\nprint(f"Is \'blue\' in colors? {\'blue\' in colors}")\nprint(f"Is \'green\' in colors? {\'green\' not in colors}") # \'green\' was removed',
        explanation: 'We demonstrate creating sets (from lists and literals), highlighting automatic duplicate removal and unordered nature. Key set operations (union, intersection, difference, symmetric difference) are shown using both operators and methods. Methods for adding (`add`, `update`) and removing (`remove`, `discard`) elements are also covered, along with efficient membership testing.',
        output: 'Set from list: {1, 2, 3, 4}\nLiteral set: {\'apple\', \'cherry\', \'banana\'} (order may vary)\nSet A: {1, 2, 3, 4, 5}, Set B: {4, 5, 6, 7, 8}\nUnion (A | B): {1, 2, 3, 4, 5, 6, 7, 8}\nIntersection (A & B): {4, 5}\nDifference (A - B): {1, 2, 3}\nSymmetric Difference (A ^ B): {1, 2, 3, 6, 7, 8}\nAfter adding yellow: {\'green\', \'blue\', \'yellow\', \'red\'} (order may vary)\nAfter update: {\'green\', \'blue\', \'yellow\', \'orange\', \'purple\', \'red\'} (order may vary)\nAfter remove/discard: {\'blue\', \'yellow\', \'orange\', \'purple\', \'red\'} (order may vary)\nIs \'blue\' in colors? True\nIs \'green\' in colors? True'
      },
      exercise: {
        instruction: 'You have two lists of student names who attended different workshops:\n`workshop_A = ["Alice", "Bob", "Charlie", "David"]`\n`workshop_B = ["Charlie", "David", "Eve", "Frank"]`\nUsing sets, find and print:\n1. A list of all unique students who attended at least one workshop.\n2. A list of students who attended BOTH workshops.\n3. A list of students who attended Workshop A but NOT Workshop B.',
        starterCode: 'workshop_A = ["Alice", "Bob", "Charlie", "David"]\nworkshop_B = ["Charlie", "David", "Eve", "Frank"]\n\n# Convert lists to sets\n# set_A = ...\n# set_B = ...\n\n# Perform set operations\n# all_students = ...\n# common_students = ...\n# a_only_students = ...\n\n# print(f"All unique students: {sorted(list(all_students))}")\n# print(f"Students in both workshops: {sorted(list(common_students))}")\n# print(f"Students in Workshop A only: {sorted(list(a_only_students))}")',
        expectedOutput: 'All unique students: [\'Alice\', \'Bob\', \'Charlie\', \'David\', \'Eve\', \'Frank\']\nStudents in both workshops: [\'Charlie\', \'David\']\nStudents in Workshop A only: [\'Alice\', \'Bob\']'
      }
    }
  },
  {
    id: '4-5',
    chapterId: 4,
    title: 'Nested Data Structures',
    description: 'Combine lists, dictionaries, tuples, and sets for complex data representation',
    difficulty: 3,
    content: {
      introduction: 'Real-world data is often hierarchical or structured in complex ways. Python\'s data structures can be nested within each other (e.g., a list of dictionaries, a dictionary where values are lists, etc.) to represent such intricate data, like JSON objects, XML trees, or database records.',
      concept: 'You can freely nest Python\'s built-in data structures. For example:\n- A list can contain other lists or dictionaries.\n- A dictionary\'s values can be lists, other dictionaries, or any Python object.\n- Tuples can contain lists (though the tuple itself remains immutable, its mutable elements like lists can be changed).\nAccessing elements in nested structures involves chaining index or key lookups.',
      example: {
        code: '# Example 1: List of Dictionaries (common for representing records)\nstudents = [\n    {"id": 101, "name": "Alice Wonderland", "grades": {"math": 90, "science": 85, "history": 95}},\n    {"id": 102, "name": "Bob The Builder", "grades": {"math": 80, "science": 88, "history": 92}},\n    {"id": 103, "name": "Charlie Brown", "grades": {"math": 95, "science": 91, "history": 89}}\n]\n\n# Accessing nested data\nprint(f"First student\'s name: {students[0][\'name\']}")\nprint(f"Bob\'s science grade: {students[1][\'grades\'][\'science\']}")\n\n# Example 2: Dictionary with Nested Structures\nschool_data = {\n    "school_name": "Springfield High",\n    "principal": {"name": "Seymour Skinner", "years_experience": 15},\n    "departments": [\n        {"name": "Mathematics", "head": "Dr. Hibbert", "courses": ["Algebra I", "Calculus AB", "Statistics"]},\n        {"name": "Science", "head": "Prof. Frink", "courses": ["Biology 101", "Chemistry Lab", "Physics Mechanics"]}\n    ]\n}\n\n# Accessing data from the school_data dictionary\nprint(f"School Name: {school_data[\'school_name\']}")\nprint(f"Principal\'s Name: {school_data[\'principal\'][\'name\']}")\nprint(f"First department\'s name: {school_data[\'departments\'][0][\'name\']}")\nprint(f"Science department courses: {school_data[\'departments\'][1][\'courses\']}")\nprint(f"Second course in Science dept: {school_data[\'departments\'][1][\'courses\'][1]}")',
        explanation: 'We demonstrate two common nested structures: a list of dictionaries (each dictionary representing a student record with nested grades) and a dictionary containing other dictionaries and lists (representing school information). Accessing elements requires chaining indexing for lists and key lookups for dictionaries.',
        output: 'First student\'s name: Alice Wonderland\nBob\'s science grade: 88\nSchool Name: Springfield High\nPrincipal\'s Name: Seymour Skinner\nFirst department\'s name: Mathematics\nScience department courses: [\'Biology 101\', \'Chemistry Lab\', \'Physics Mechanics\']\nSecond course in Science dept: Chemistry Lab'
      },
      exercise: {
        instruction: 'Create a nested data structure to represent a simple e-commerce inventory. It should be a dictionary where keys are category names (e.g., "Electronics", "Books"). Each category should map to a list of product dictionaries. Each product dictionary should have "name", "price", and "stock" (quantity). \nPopulate it with at least two categories and two products per category. Then, write code to find and print the name of the most expensive product across all categories.',
        starterCode: 'inventory = {\n    # "CategoryName": [\n    #     {"name": "ProductName", "price": 0.0, "stock": 0},\n    #     ...\n    # ],\n    # ...\n}\n\n# Populate your inventory here\n\n# Find the most expensive product\n# most_expensive_product_name = None\n# highest_price = -1\n# for category_products in inventory.values():\n#     for product in category_products:\n#         ...\n# print(f"The most expensive product is: {most_expensive_product_name}")',
        expectedOutput: 'The most expensive product is: [Name of your most expensive product]' // e.g., "Laptop Pro"
      }
    }
  },
  {
    id: '4-6',
    chapterId: 4,
    title: 'Advanced List Comprehensions',
    description: 'Master powerful one-line list creation with conditions and nesting',
    difficulty: 3,
    content: {
      introduction: 'List comprehensions are a concise and readable way to create lists in Python. Advanced comprehensions can include conditional logic (`if` clauses) for filtering elements, `if-else` expressions for conditional assignment, and even nested loops for more complex list generation.',
      concept: 'A list comprehension follows the general syntax: `[expression for item in iterable if condition]`. \n- The `expression` is what each element of the new list will be.\n- `for item in iterable` is the loop part.\n- `if condition` (optional) filters items from the iterable.\n- You can also use an `if-else` directly in the `expression` part: `[value_if_true if condition else value_if_false for item in iterable]`. \n- Nested `for` loops are also possible for iterating over nested iterables.',
      example: {
        code: '# Basic list comprehension (recap)\nnumbers = [1, 2, 3, 4, 5, 6]\nsquares = [x**2 for x in numbers]\nprint(f"Squares: {squares}")\n\n# List comprehension with an 'if' condition (filtering)\neven_squares = [x**2 for x in numbers if x % 2 == 0]\nprint(f"Squares of even numbers: {even_squares}")\n\n# List comprehension with an 'if-else' in the expression\nparity_labels = ["even" if x % 2 == 0 else "odd" for x in numbers]\nprint(f"Parity labels: {parity_labels}")\n\n# Nested list comprehension (e.g., flatten a list of lists)\nmatrix = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]\nflattened_list = [element for row in matrix for element in row]\nprint(f"Flattened matrix: {flattened_list}")\n\n# Transpose a matrix (list of lists) using nested comprehension\noriginal_matrix = [[1, 2, 3], [4, 5, 6]] # 2x3 matrix\ntransposed_matrix = [[row[i] for row in original_matrix] for i in range(len(original_matrix[0]))]\nprint(f"Original Matrix: {original_matrix}")\nprint(f"Transposed Matrix: {transposed_matrix}") # Should be 3x2',
        explanation: 'We demonstrate various forms of list comprehensions: basic squaring, filtering for even numbers before squaring, using an `if-else` in the expression to assign labels, flattening a list of lists, and transposing a matrix. These show the power and conciseness of list comprehensions.',
        output: 'Squares: [1, 4, 9, 16, 25, 36]\nSquares of even numbers: [4, 16, 36]\nParity labels: [\'odd\', \'even\', \'odd\', \'even\', \'odd\', \'even\']\nFlattened matrix: [1, 2, 3, 4, 5, 6, 7, 8, 9]\nOriginal Matrix: [[1, 2, 3], [4, 5, 6]]\nTransposed Matrix: [[1, 4], [2, 5], [3, 6]]'
      },
      exercise: {
        instruction: 'Given a list of strings: `words = ["apple", "Banana", "Cherry", "date", "Elderberry"]`. Use a list comprehension to create a new list containing only the words that start with an uppercase letter AND have a length greater than 5. Convert these selected words to lowercase in the new list.',
        starterCode: 'words = ["apple", "Banana", "Cherry", "date", "Elderberry"]\n# Use a list comprehension with multiple conditions and transformation\n# selected_words = [... for word in words if ... and ...]\n# print(selected_words)',
        expectedOutput: "['banana', 'cherry', 'elderberry']"
      }
    }
  },
  {
    id: '4-7',
    chapterId: 4,
    title: 'Dictionary and Set Comprehensions',
    description: 'Create dictionaries and sets with concise, expressive syntax',
    difficulty: 3,
    content: {
      introduction: 'Similar to list comprehensions, Python also offers concise syntax for creating dictionaries and sets. These comprehensions make your code more readable and often more efficient for constructing these data structures from iterables.',
      concept: '- **Dictionary Comprehension**: Syntax ` {key_expression: value_expression for item in iterable if condition} `. Creates a dictionary.\n- **Set Comprehension**: Syntax ` {expression for item in iterable if condition} `. Creates a set (automatically handles uniqueness). \nBoth can include conditional filtering and transformations on the items from the iterable.',
      example: {
        code: '# Dictionary comprehension: map numbers to their squares\nnumbers_list = [1, 2, 3, 4, 5]\nsquares_dictionary = {x: x**2 for x in numbers_list}\nprint(f"Squares dictionary: {squares_dictionary}")\n\n# Dictionary comprehension with a condition\neven_num_squares = {x: x**2 for x in numbers_list if x % 2 == 0}\nprint(f"Even number squares dictionary: {even_num_squares}")\n\n# Creating a dictionary from two lists (using zip)\nfruits = ["apple", "banana", "cherry"]\nprices = [1.20, 0.50, 2.50]\nfruit_price_dict = {fruit: price for fruit, price in zip(fruits, prices) if price < 2.0}\nprint(f"Affordable fruit prices: {fruit_price_dict}")\n\n# Set comprehension: create a set of unique characters from a string\ntext = "hello world hello python"\nunique_chars_set = {char for char in text if char.isalpha()} # only letters\nprint(f"Unique alphabetic characters: {sorted(list(unique_chars_set))}") # Sorted for consistent output\n\n# Set comprehension with condition\nnumbers_set = {x**2 for x in range(10) if x % 2 != 0} # Squares of odd numbers < 10\nprint(f"Squares of odd numbers set: {numbers_set}")',
        explanation: 'We demonstrate dictionary comprehensions for creating dictionaries from lists (mapping numbers to squares, filtering, using `zip`). Set comprehensions are shown for extracting unique characters from a string and for creating a set based on a condition. These comprehensions provide a compact and Pythonic way to build dictionaries and sets.',
        output: 'Squares dictionary: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\nEven number squares dictionary: {2: 4, 4: 16}\nAffordable fruit prices: {\'apple\': 1.2, \'banana\': 0.5}\nUnique alphabetic characters: [\'d\', \'e\', \'h\', \'l\', \'n\', \'o\', \'p\', \'r\', \'t\', \'w\', \'y\']\nSquares of odd numbers set: {1, 9, 25, 49, 81}'
      },
      exercise: {
        instruction: 'Given a list of words: `word_list = ["apple", "banana", "apple", "cherry", "banana", "date"]`. Use a dictionary comprehension to create a dictionary where keys are the unique words from the list and values are the lengths of these words.',
        starterCode: 'word_list = ["apple", "banana", "apple", "cherry", "banana", "date"]\n# Use a dictionary comprehension. Hint: you might want to get unique words first (e.g., using a set).\n# word_lengths_dict = {word: len(word) for word in set(word_list)}\n# print(word_lengths_dict)',
        expectedOutput: "{'apple': 5, 'banana': 6, 'cherry': 6, 'date': 4}" // Order may vary
      }
    }
  },
  {
    id: '4-8',
    chapterId: 4,
    title: 'NamedTuples and DataClasses',
    description: 'Create structured, readable data objects with named fields',
    difficulty: 4,
    content: {
      introduction: 'For creating more structured data objects than plain tuples or dictionaries, Python offers `collections.namedtuple` and (since Python 3.7) `dataclasses`. These provide ways to create simple classes for storing data with named fields, improving code readability and maintainability.',
      concept: '- **`collections.namedtuple`**: A factory function for creating tuple subclasses with named fields. Instances are immutable, lightweight, and accessible by name or index.\n- **`@dataclasses.dataclass`**: A decorator that automatically generates methods like `__init__()`, `__repr__()`, `__eq__()`, etc., for classes primarily used to store data. Fields are defined using type hints. Instances are mutable by default but can be made immutable (`frozen=True`).',
      example: {
        code: '# Using collections.namedtuple\nfrom collections import namedtuple\n\n# Define a named tuple type called "Point"\nPoint = namedtuple("Point", ["x", "y", "z"])\n\n# Create instances\norigin = Point(0, 0, 0)\npt1 = Point(x=1, y=2, z=3)\n\nprint(f"Origin: {origin}")\nprint(f"Point 1: x={pt1.x}, y={pt1.y}, z={pt1.z}")\nprint(f"Access by index: pt1[1] = {pt1[1]}") # pt1.y\n\n# Using dataclasses (Python 3.7+)\nfrom dataclasses import dataclass, field\n\n@dataclass(frozen=False) # frozen=True makes it immutable\nclass InventoryItem:\n    name: str\n    unit_price: float\n    quantity_on_hand: int = 0 # Default value\n    tags: list[str] = field(default_factory=list) # Default for mutable types\n\n    def total_value(self) -> float:\n        return self.unit_price * self.quantity_on_hand\n\nitem1 = InventoryItem("Laptop", 999.99, 5, tags=[\"electronics\", \"computer\"])\nitem2 = InventoryItem("Mouse", 25.50)\nitem2.quantity_on_hand = 10\n\nprint(f"\\nItem 1: {item1}")\nprint(f"Item 1 Name: {item1.name}, Total Value: ${item1.total_value():.2f}")\nprint(f"Item 2 Tags: {item2.tags}")',
        explanation: 'We first demonstrate `namedtuple` by creating a `Point` type. Instances are created and fields are accessed by name or index. Then, we use the `@dataclass` decorator to create an `InventoryItem` class. This automatically provides an initializer, string representation, etc. We show default values for fields and a custom method `total_value()`. `field(default_factory=list)` is used for mutable default values like lists.',
        output: 'Origin: Point(x=0, y=0, z=0)\nPoint 1: x=1, y=2, z=3\nAccess by index: pt1[1] = 2\n\nItem 1: InventoryItem(name=\'Laptop\', unit_price=999.99, quantity_on_hand=5, tags=[\'electronics\', \'computer\'])\nItem 1 Name: Laptop, Total Value: $4999.95\nItem 2 Tags: []'
      },
      exercise: {
        instruction: '1. Define a `namedtuple` called `Book` with fields: `title`, `author`, and `isbn`.\n2. Create an instance of `Book`.\n3. Define a `dataclass` called `Movie` with fields: `title` (str), `director` (str), `year` (int), and `rating` (float, with a default of 0.0).\n4. Create an instance of `Movie`.\nPrint both instances.',
        starterCode: '# Import namedtuple and dataclass\n\n# 1. Define and create Book instance\n# Book = ...\n# my_book = ...\n\n# 2. Define and create Movie instance\n# @dataclass\n# class Movie:\n#     ...\n# my_movie = ...\n\n# print(my_book)\n# print(my_movie)',
        expectedOutput: 'Book(title=\'Sample Book\', author=\'Author Name\', isbn=\'1234567890\')\nMovie(title=\'Sample Movie\', director=\'Director Name\', year=2023, rating=0.0)' // Example values
      }
    }
  },
  {
    id: '4-9',
    chapterId: 4,
    title: 'The `collections` Module: Specialized Containers',
    description: 'Explore advanced container datatypes like Counter, defaultdict, and deque',
    difficulty: 4,
    content: {
      introduction: 'Python\'s `collections` module provides specialized container datatypes that offer alternatives to the general-purpose built-ins (dict, list, set, tuple). These are useful for specific tasks and can often lead to more efficient or cleaner code.',
      concept: 'Key data structures in `collections` include:\n- **`Counter`**: A dict subclass for counting hashable objects. Elements are stored as dictionary keys and their counts are stored as dictionary values.\n- **`defaultdict`**: A dict subclass that calls a factory function to supply missing values. If a key is accessed and not found, the factory function is called to create a default value for it.\n- **`deque`** (double-ended queue): A list-like container with fast appends and pops from both ends.\n- **`OrderedDict`**: A dict subclass that remembers the order entries were added (less critical since Python 3.7+ where standard dicts also remember insertion order).',
      example: {
        code: 'from collections import Counter, defaultdict, deque, OrderedDict\n\n# Counter: Count occurrences of items in a list\nword_list = ["apple", "banana", "apple", "cherry", "apple", "banana", "orange"]\nword_counts = Counter(word_list)\nprint(f"Word counts: {word_counts}")\nprint(f"Most common word: {word_counts.most_common(1)}")\nprint(f"Count of \'apple\': {word_counts[\'apple\']}")\n\n# defaultdict: Group items (e.g., by first letter)\nnames = ["Alice", "Bob", "Anna", "Charlie", "Ben"]\nnames_by_letter = defaultdict(list) # Default factory is list, so new keys get []\nfor name in names:\n    names_by_letter[name[0]].append(name)\nprint(f"\\nNames grouped by first letter: {dict(names_by_letter)}") # Convert to dict for cleaner print\nprint(f"Names starting with Z (default): {names_by_letter[\'Z\']}")\n\n# deque: Efficient appends and pops from both ends\nqueue = deque([1, 2, 3])\nqueue.append(4)       # Append to the right: deque([1, 2, 3, 4])\nqueue.appendleft(0)   # Append to the left: deque([0, 1, 2, 3, 4])\nprint(f"\\nDeque after appends: {queue}")\nright_popped = queue.pop()      # Pop from the right: 4\nleft_popped = queue.popleft() # Pop from the left: 0\nprint(f"Deque after pops (right:{right_popped}, left:{left_popped}): {queue}")\n\n# OrderedDict (maintains insertion order - standard dicts do this since Python 3.7)\nordered_data = OrderedDict()\nordered_data[\'first\'] = 1\nordered_data[\'second\'] = 2\nordered_data[\'third\'] = 3\nprint(f"\\nOrderedDict: {ordered_data}")',
        explanation: 'We demonstrate `Counter` for frequency counting, `defaultdict` for grouping items without checking if a key exists, `deque` for efficient queue/stack operations from both ends, and `OrderedDict` which preserves insertion order (though standard Python dictionaries now also do this since version 3.7).',
        output: 'Word counts: Counter({\'apple\': 3, \'banana\': 2, \'cherry\': 1, \'orange\': 1})\nMost common word: [(\'apple\', 3)]\nCount of \'apple\': 3\n\nNames grouped by first letter: {\'A\': [\'Alice\', \'Anna\'], \'B\': [\'Bob\', \'Ben\'], \'C\': [\'Charlie\']}\nNames starting with Z (default): []\n\nDeque after appends: deque([0, 1, 2, 3, 4])\nDeque after pops (right:4, left:0): deque([1, 2, 3])\n\nOrderedDict: OrderedDict([(\'first\', 1), (\'second\', 2), (\'third\', 3)])'
      },
      exercise: {
        instruction: '1. Use `Counter` to find the frequency of each character in the string "abracadabra".\n2. Use `defaultdict(int)` to count word frequencies in the sentence "the quick brown fox jumps over the lazy dog". The default factory `int` will initialize counts to 0 for new words.',
        starterCode: '# Import Counter and defaultdict\n\n# 1. Character frequency\n# text1 = "abracadabra"\n# char_counts = ...\n# print(f"Character counts: {char_counts}")\n\n# 2. Word frequency\n# text2 = "the quick brown fox jumps over the lazy dog"\n# word_freq = defaultdict(int)\n# for word in text2.split():\n#     ...\n# print(f"Word frequencies: {dict(word_freq)}")',
        expectedOutput: 'Character counts: Counter({\'a\': 5, \'b\': 2, \'r\': 2, \'c\': 1, \'d\': 1})\nWord frequencies: {\'the\': 2, \'quick\': 1, \'brown\': 1, \'fox\': 1, \'jumps\': 1, \'over\': 1, \'lazy\': 1, \'dog\': 1}'
      }
    }
  },
  {
    id: '4-10',
    chapterId: 4,
    title: 'Working with JSON Data',
    description: 'Parse (load) and create (dump) JSON data structures in Python',
    difficulty: 3,
    content: {
      introduction: 'JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format. It\'s easy for humans to read and write, and easy for machines to parse and generate. Python has excellent built-in support for JSON via the `json` module, making it straightforward to work with web APIs, configuration files, and data exchange between different systems.',
      concept: 'The `json` module provides two main functions:\n- **`json.dumps(obj, indent=None)`**: Serializes a Python object `obj` (like dicts, lists, strings, numbers, booleans, None) into a JSON formatted string. `indent` can be used for pretty-printing.\n- **`json.loads(s)`**: Deserializes a JSON formatted string `s` into a Python object.\nJSON objects map to Python dictionaries, JSON arrays map to Python lists, JSON strings to Python strings, etc.',
      example: {
        code: 'import json\n\n# Python dictionary (similar to a JSON object)\npython_data = {\n    "name": "Alice Wonderland",\n    "age": 30,\n    "is_active_user": True,\n    "skills": ["Python", "Data Analysis", "SQL"],\n    "contact": {\n        "email": "alice@example.com",\n        "phone": None # None becomes null in JSON\n    }\n}\n\n# 1. Serialize Python object to JSON string (json.dumps)\njson_string = json.dumps(python_data, indent=2) # indent for pretty printing\nprint("JSON String:")\nprint(json_string)\n\n# 2. Deserialize JSON string back to Python object (json.loads)\nparsed_python_data = json.loads(json_string)\nprint("\\nParsed Python Data (from JSON string):")\nprint(parsed_python_data)\nprint(f"Name from parsed data: {parsed_python_data[\'name\']}")\nprint(f"First skill: {parsed_python_data[\'skills\'][0]}")\nprint(f"Email: {parsed_python_data[\'contact\'][\'email\']}")\n\n# Example of a JSON string you might receive\nincoming_json_string = \'{"id": 123, "productName": "Wireless Mouse", "price": 29.99, "tags": ["electronics", "computer accessory"]}\'\nproduct_object = json.loads(incoming_json_string)\nprint(f"\\nProduct Name: {product_object[\'productName\']}")',
        explanation: 'We start with a Python dictionary `python_data`. `json.dumps()` converts this into a JSON formatted string, `json_string`, with an indent of 2 for readability. Then, `json.loads()` parses this `json_string` back into an equivalent Python dictionary, `parsed_python_data`. We also show parsing an example JSON string directly.',
        output: 'JSON String:\n{\n  "name": "Alice Wonderland",\n  "age": 30,\n  "is_active_user": true,\n  "skills": [\n    "Python",\n    "Data Analysis",\n    "SQL"\n  ],\n  "contact": {\n    "email": "alice@example.com",\n    "phone": null\n  }\n}\n\nParsed Python Data (from JSON string):\n{\'name\': \'Alice Wonderland\', \'age\': 30, \'is_active_user\': True, \'skills\': [\'Python\', \'Data Analysis\', \'SQL\'], \'contact\': {\'email\': \'alice@example.com\', \'phone\': None}}\nName from parsed data: Alice Wonderland\nFirst skill: Python\nEmail: alice@example.com\n\nProduct Name: Wireless Mouse'
      },
      exercise: {
        instruction: '1. Create a Python dictionary representing a configuration with at least three settings (e.g., `{"theme": "dark", "fontSize": 14, "autoSave": True}`).\n2. Convert this dictionary to a JSON string with an indent of 4.\n3. Print the JSON string.\n4. Now, take the JSON string `data_str = \'{"book_title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year_published": 1925}\'` and convert it back into a Python dictionary. Print the author\'s name from the resulting dictionary.',
        starterCode: 'import json\n\n# 1. Create Python dictionary for configuration\n# config_dict = ...\n\n# 2. Convert to JSON string\n# config_json_string = ...\n\n# 3. Print JSON string\n# print("Configuration JSON:")\n# print(config_json_string)\n\n# 4. Parse given JSON string and print author\n# data_str = \'{"book_title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year_published": 1925}\'\n# book_dict = ...\n# print(f"\\nAuthor from parsed data: {book_dict[\'author\']}")',
        expectedOutput: 'Configuration JSON:\n{\n    "theme": "dark",\n    "fontSize": 14,\n    "autoSave": true\n}\n\nAuthor from parsed data: F. Scott Fitzgerald'
      }
    }
  },
  // Placeholder for future lessons in Chapter 5-10
  // To add more lessons, follow the structure above, ensuring unique `id` and correct `chapterId`.
];
