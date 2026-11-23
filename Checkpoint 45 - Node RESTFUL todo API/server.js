import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = 3000;

// In-memory data store
let todos = [
  { id: randomUUID(), title: "Review HTTP status codes", completed: true },
  { id: randomUUID(), title: "Build Node.js core REST API", completed: false },
];

/**
 * Helper to send standardized JSON responses
 */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

/**
 * Helper to asynchronously read and parse JSON request bodies
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk.toString();
    });

    req.on("end", () => {
      if (!rawBody.trim()) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", (err) => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method;

  // Route 1: Collection endpoint (/todos)
  if (pathname === "/todos") {
    // READ ALL (GET /todos)
    if (method === "GET") {
      return sendJson(res, 200, { count: todos.length, data: todos });
    }

    // CREATE (POST /todos)
    if (method === "POST") {
      try {
        const body = await parseRequestBody(req);

        if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
          return sendJson(res, 400, {
            error: "Validation failed: 'title' is required and must be a non-empty string.",
          });
        }

        if (body.completed !== undefined && typeof body.completed !== "boolean") {
          return sendJson(res, 400, {
            error: "Validation failed: 'completed' must be a boolean.",
          });
        }

        const newTodo = {
          id: randomUUID(),
          title: body.title.trim(),
          completed: body.completed ?? false,
        };

        todos.push(newTodo);
        return sendJson(res, 201, newTodo);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    return sendJson(res, 405, { error: `Method ${method} not allowed on /todos` });
  }

  // Route 2: Item endpoint (/todos/:id)
  const itemMatch = pathname.match(/^\/todos\/([^/]+)$/);
  if (itemMatch) {
    const todoId = itemMatch[1];
    const todoIndex = todos.findIndex((t) => t.id === todoId);

    if (todoIndex === -1) {
      return sendJson(res, 404, { error: `Todo with id '${todoId}' not found.` });
    }

    // READ ONE (GET /todos/:id)
    if (method === "GET") {
      return sendJson(res, 200, todos[todoIndex]);
    }

    // UPDATE (PUT or PATCH /todos/:id)
    if (method === "PUT" || method === "PATCH") {
      try {
        const body = await parseRequestBody(req);

        if (body.title !== undefined) {
          if (typeof body.title !== "string" || !body.title.trim()) {
            return sendJson(res, 400, {
              error: "Validation failed: 'title' must be a non-empty string.",
            });
          }
          todos[todoIndex].title = body.title.trim();
        }

        if (body.completed !== undefined) {
          if (typeof body.completed !== "boolean") {
            return sendJson(res, 400, {
              error: "Validation failed: 'completed' must be a boolean.",
            });
          }
          todos[todoIndex].completed = body.completed;
        }

        if (body.title === undefined && body.completed === undefined) {
          return sendJson(res, 400, {
            error: "Validation failed: Provide 'title' and/or 'completed' to update.",
          });
        }

        return sendJson(res, 200, todos[todoIndex]);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    // DELETE (DELETE /todos/:id)
    if (method === "DELETE") {
      const [deleted] = todos.splice(todoIndex, 1);
      return sendJson(res, 200, { message: "Todo deleted successfully.", data: deleted });
    }

    return sendJson(res, 405, { error: `Method ${method} not allowed on /todos/:id` });
  }

  // Fallback 404 for unknown routes
  return sendJson(res, 404, { error: "Route not found. Available endpoints: /todos, /todos/:id" });
});

server.listen(PORT, () => {
  console.log(`To-Do REST API running at http://localhost:${PORT}/todos`);
});