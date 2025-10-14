import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import webPush from "web-push";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${port}`);
});


const vapidKeys = {
  publicKey: 'BCktAlsTxEKwTV7scYU-f45yGsPZSdMs9rO0zqEYjxcg5jtWMTJ0oX1iVCyUyoybG8s8q1SnP9XgpmF1YhTCe_U',
  privateKey: 'LlHhvrzCHJZC8eRBqBd-al5-AuEdz8Qhwn961DaJOwQ'
};


app.get('/vapidPublicKey', (req, res) => {
  res.send(vapidKeys.publicKey);
});

const subscriptions = [];

webPush.setVapidDetails(
  'mailto:jakubkita98@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  
  // Validate subscription has required endpoint property
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription: missing endpoint' });
  }
  
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/notifications/send', (req, res) => {
  // Filter out invalid subscriptions before sending
  const validSubscriptions = subscriptions.filter(sub => sub && sub.endpoint);
  
  if (validSubscriptions.length === 0) {
    return res.status(400).json({ error: 'No valid subscriptions available' });
  }
  
  const promises = validSubscriptions.map(sub =>
    webPush.sendNotification(sub, JSON.stringify({
      notification: {
        title: req.body.title,
        body: req.body.description,
        image: "http://localhost:3000/image.jpg"
      }
    }))
  );

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
    .catch(err => {
      console.error('Error sending notification, reason: ', err);
      
      // If subscription is expired (410), remove it from subscriptions
      if (err.statusCode === 410) {
        const invalidEndpoint = err.endpoint;
        const index = subscriptions.findIndex(sub => sub.endpoint === invalidEndpoint);
        if (index > -1) {
          subscriptions.splice(index, 1);
          console.log('Removed expired subscription:', invalidEndpoint);
        }
        return res.status(200).json({ message: 'Notification sent to valid subscriptions. Expired subscription removed.' });
      }
      
      res.sendStatus(500);
    });
});

app.get('/flashcards', (req, res) => {
    res.status(200).json([
        {
            "id": 1,
            "question": "What is the difference between `let`, `const`, and `var` in JavaScript?",
            "answer": "`let` and `const` are block-scoped, `var` is function-scoped. `const` cannot be reassigned, `let` can. `var` is hoisted and can be redeclared."
        },
        {
            "id": 2,
            "question": "What is a closure in JavaScript?",
            "answer": "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It 'closes over' those variables."
        },
        {
            "id": 3,
            "question": "What is the difference between `==` and `===` in JavaScript?",
            "answer": "`==` performs type coercion before comparison, `===` (strict equality) compares both value and type without coercion. Always prefer `===`."
        },
        {
            "id": 4,
            "question": "What is the event loop in JavaScript?",
            "answer": "The event loop is what allows JavaScript to perform non-blocking operations by offloading operations to the system and handling callbacks when they complete."
        },
        {
            "id": 5,
            "question": "What is the difference between `null` and `undefined`?",
            "answer": "`undefined` means a variable has been declared but not assigned. `null` is an intentional absence of value. Both are falsy but different types."
        },
        {
            "id": 6,
            "question": "What is destructuring in JavaScript?",
            "answer": "Destructuring allows extracting values from arrays or properties from objects into distinct variables using a syntax that mirrors array/object literals."
        },
        {
            "id": 7,
            "question": "What is the difference between `Promise` and `async/await`?",
            "answer": "`async/await` is syntactic sugar over Promises. It makes asynchronous code look synchronous and easier to read, but both handle asynchronous operations."
        },
        {
            "id": 8,
            "question": "What is hoisting in JavaScript?",
            "answer": "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. `var` is hoisted and initialized with `undefined`."
        },
        {
            "id": 9,
            "question": "What is the spread operator (`...`) used for?",
            "answer": "The spread operator expands iterables (arrays, strings, objects) into individual elements. Used for copying arrays/objects, function arguments, and merging."
        },
        {
            "id": 10,
            "question": "What is the difference between `map()`, `filter()`, and `reduce()`?",
            "answer": "`map()` transforms each element, `filter()` selects elements based on condition, `reduce()` accumulates elements into a single value. All return new arrays/values."
        },
        {
            "id": 11,
            "question": "What is a callback function?",
            "answer": "A callback is a function passed as an argument to another function and executed at a specific time. Used for handling asynchronous operations and events."
        },
        {
            "id": 12,
            "question": "What is the `this` keyword in JavaScript?",
            "answer": "`this` refers to the object that is executing the current function. Its value depends on how the function is called (context). Arrow functions inherit `this` from enclosing scope."
        },
        {
            "id": 13,
            "question": "What is a prototype in JavaScript?",
            "answer": "Every JavaScript object has a prototype property that allows adding properties and methods to object constructors. It's the mechanism by which objects inherit features."
        },
        {
            "id": 14,
            "question": "What is the difference between synchronous and asynchronous JavaScript?",
            "answer": "Synchronous code executes line by line, blocking subsequent code. Asynchronous code doesn't block execution, using callbacks, promises, or async/await."
        },
        {
            "id": 15,
            "question": "What is JSON and how do you work with it in JavaScript?",
            "answer": "JSON (JavaScript Object Notation) is a text format for data exchange. Use `JSON.stringify()` to convert objects to JSON, `JSON.parse()` to convert JSON to objects."
        },
        {
            "id": 16,
            "question": "What are template literals in JavaScript?",
            "answer": "Template literals use backticks (`) and allow embedded expressions with ${}, multi-line strings, and string interpolation. More powerful than regular strings."
        },
        {
            "id": 17,
            "question": "What is the difference between `call()`, `apply()`, and `bind()`?",
            "answer": "`call()` and `apply()` invoke functions immediately with specified `this`. `call()` takes arguments individually, `apply()` takes array. `bind()` returns new function."
        },
        {
            "id": 18,
            "question": "What are arrow functions and how do they differ from regular functions?",
            "answer": "Arrow functions have shorter syntax, don't have their own `this`, `arguments`, or `super`. They inherit `this` from enclosing scope and can't be constructors."
        },
        {
            "id": 19,
            "question": "What is event bubbling and event capturing?",
            "answer": "Event bubbling: events start from target element and bubble up to parents. Event capturing: events start from root and go down to target. Use `stopPropagation()` to stop."
        },
        {
            "id": 20,
            "question": "What is the difference between deep copy and shallow copy?",
            "answer": "Shallow copy copies only the first level properties. Deep copy recursively copies all nested objects/arrays. Use `structuredClone()` or libraries like Lodash for deep copy."
        }
    ])
})