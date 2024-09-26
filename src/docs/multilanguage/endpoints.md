# Multilenguage endpoint documentation

## Authentication

### `POST /auth/login`

- **Description:** Log in a user.
- **Parameters:**
  - `username` (string): El nombre de usuario.
  - `password` (string): La contraseña del usuario.
- **Answers:**
  - `200 OK`: Returns an access token.
    - **en:** "Login successful"
    - **es:** "Inicio de sesión exitoso"
  - `401 Unauthorized`: Invalid credentials.
    - **en:** "Invalid credentials"
    - **es:** "Credenciales inválidas"
  - `500 Internal Server Error`: Server error.
    - **en:** "Internal server error"
    - **es:** "Error interno del servidor"

## User

### `POST /users`

- **Description:** Create a new user.
- **Parameters:**
  - `username` (string): El nombre de usuario.
  - `password` (string): La contraseña del usuario.
  - Other relevant parameters.
- **Answers:**
  - `201 Created`: User created successfully.
    - **en:** "User created successfully"
    - **es:** "Usuario creado exitosamente"
  - `400 Bad Request`: Bad Request.
    - **en:** "Bad Request"
    - **es:** "Solicitud incorrecta"
  - `500 Internal Server Error`: Server error.
    - **en:** "Internal server error"
    - **es:** "Error interno del servidor"

## Quotes

### `GET /quotes`

- **Description:** Get all quotes.
- **Answers:**
  - `200 OK`: Returns all contributions.
    - **en:** "Fetched all quotes"
    - **es:** "Se obtuvieron todas las cotizaciones"
  - `500 Internal Server Error`: Server error.
    - **en:** "Error fetching quotes"
    - **es:** "Error al obtener las cotizaciones"

### `POST /quotes`

- **Description:** Create a new price.
- **Parameters:**
  - Relevant parameters.
- **Answers:**
  - `201 Created`: Cotización creada exitosamente.
    - **en:** "Quote created successfully"
    - **es:** "Cotización creada exitosamente"
  - `400 Bad Request`: Bad Request.
    - **en:** "Bad Request"
    - **es:** "Solicitud incorrecta"
  - `500 Internal Server Error`: Server error.
    - **en:** "Internal server error"
    - **es:** "Error interno del servidor"

### `POST /quotes/recurrence`

- **Description:** Create a new recurring quotation.
- **Parameters:**
  - `quoteId` (number): El ID de la cotización base.
  - `frequency` (string): La frecuencia de la recurrencia (`weekly`, `monthly`, `yearly`).
  - `interval` (number): El intervalo de la recurrencia.
  - `daysOfWeek` (array): Los días de la semana para la recurrencia semanal.
  - `dayOfMonth` (number): El día del mes para la recurrencia mensual.
  - `monthsOfYear` (array): Los meses del año para la recurrencia anual.
  - `endDateRecurr` (string): La fecha de fin de la recurrencia.
  - `occurrences` (number): El número de ocurrencias.
- **Answers:**
  - `201 Created`:Recurrent quotation created successfully.
    - **en:** "Recurrence quote created successfully"
    - **es:** "Cotización recurrente creada exitosamente"
  - `400 Bad Request`: Solicitud incorrecta.
    - **en:** "Bad Request"
    - **es:** "Solicitud incorrecta"
  - `404 Not Found`: The base price was not found.
    - **en:** "Quote not found"
    - **es:** "Cotización no encontrada"
  - `500 Internal Server Error`: Server error.
    - **en:** "Internal server error"
    - **es:** "Error interno del servidor"

### `PUT /quotes/recurrence/:id`

- **Description:** Update an existing recurrent quotation.
- **Parámetros:**
  - `quoteId` (number): El ID de la cotización base.
  - `frequency` (string): La frecuencia de la recurrencia (`weekly`, `monthly`, `yearly`).
  - `interval` (number): El intervalo de la recurrencia.
  - `daysOfWeek` (array): Los días de la semana para la recurrencia semanal.
  - `dayOfMonth` (number): El día del mes para la recurrencia mensual.
  - `monthsOfYear` (array): Los meses del año para la recurrencia anual.
  - `endDateRecurr` (string): La fecha de fin de la recurrencia.
  - `occurrences` (number): El número de ocurrencias.
- **Answers:**
  - `200 OK`: Recurrent contribution updated successfully.
    - **en:** "Recurrence quote updated successfully"
    - **es:** "Cotización recurrente actualizada exitosamente"
  - `400 Bad Request`: Bad Request.
    - **en:** "Bad Request"
    - **es:** "Solicitud incorrecta"
  - `404 Not Found`: Recurrent quotation was not found.
    - **en:** "Recurrence quote not found"
    - **es:** "Cotización recurrente no encontrada"
  - `500 Internal Server Error`: Server error.
    - **en:** "Internal server error"
    - **es:** "Error interno del servidor"
