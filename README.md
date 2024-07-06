# Social Media API

## Description

EN: <BR>
Node API written in typescript, related to social media apps, in which users can to register, then create a new session. Users can add others users as friends, follow other users and undo this actions. Also users can create posts, being able to add images if they want to, after that, users can like or unlike to these posts.

ES: <br>
API de Node.js escrita en Typescript, relacionada con aplicaciones de redes sociales, en la que los usuarios pueden registrarse y luego crear una nueva sesión. Los usuarios pueden agregar a otros usuarios como amigos, seguir a otros usuarios y deshacer estas acciones. Además, los usuarios pueden crear publicaciones, pudiendo agregar imágenes si lo desean, después de eso, los usuarios pueden dar me gusta o no a las publicaciones.
<br>
<br>

## Features

EN:

- Authentication verification with json web tokens (JWT)
- Session-based user authentication
- Refresh sessions with Refresh JWT
- Logger implemented
- Locally upload for images

ES:

- Verificación de autenticación con json web tokens (JWT)
- Autenticación de usuario basada en sesiones
- Renovacion de sesiones con Refresh JWT
- Logger implementado
- Cargado local de imagenes

## Requirements

- Node.js 20.11
- NPM 9.6
- MongoDb
  <br>

## Extra Resources

![api-diagram-social](https://github.com/cris-jac/node-ts-social-api/assets/57887225/a3d824b9-9152-48dd-a2f9-38318aec49e6)
<br>
<br>

## Installation

#### Steps (EN)

1. Clone from github, using this command:<br>
   `git clone https://github.com/cris-jac/node-ts-social-api.git`

2. Navigate to the repository folder:<br>
   `cd node-ts-social-api`

3. Install dependencies:<br>
   `npm install`

4. Set environmental variables (Port number, Database URI and Secret Key) in '.env'

5. Run the app:<br>
   `npm run dev`
   <br>

#### Pasos (ES)

1. Clonar repositorio, usando este comando:<br>
   `git clone https://github.com/cris-jac/node-ts-social-api.git`

2. Navegar a directorio del repositorio:<br>
   `cd node-ts-social-api`

3. Instalar dependencias:<br>
   `npm install`

4. Definir variables de entorno (Port number, Database URI and Secret Key) en '.env'

5. Correr la aplicacion:<br>
   `npm run dev`
   <br>

<br>

## API endpoints

### Authentication (autenticacion)

### Create a new user

```http
POST /api/users
```

Payload should include user details.

---

### Create a new session (login)

```http
POST /api/sessions
```

Payload should include credentials for authentication.

---

### Get sessions (retrieve current session information)

```http
GET /api/sessions
```

No parameters required.

---

### Delete session (logout)

```http
DELETE /api/sessions
```

No parameters required.

---

### Get users by search term

```http
GET /api/users/search
```

No parameters required.

---

### Get user by ID

```http
GET /api/users/:id
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. ID of the user to fetch. |

---

### Update user information

```http
PATCH /api/users/:id
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. ID of the user to update. |

---

### Update user profile picture

```http
PATCH /api/user-profile-picture/:id
```

| Parameter | Type     | Description                                                         |
| :-------- | :------- | :------------------------------------------------------------------ |
| `id`      | `string` | **Required**. ID of the user whose profile picture will be updated. |

---

### Get user's friends

```http
GET /api/users/:id/friends
```

| Parameter | Type     | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `id`      | `string` | **Required**. ID of the user to fetch friends for. |

---

### Update user's friend information

```http
PATCH /api/users/:id/:friendId
```

| Parameter  | Type     | Description                                                 |
| :--------- | :------- | :---------------------------------------------------------- |
| `id`       | `string` | **Required**. ID of the user whose friend is being updated. |
| `friendId` | `string` | **Required**. ID of the friend to update.                   |

---

### Get users followed by a user

```http
GET /api/users/:id/following
```

| Parameter | Type     | Description                                                |
| :-------- | :------- | :--------------------------------------------------------- |
| `id`      | `string` | **Required**. ID of the user to fetch following users for. |

---

### Get users following a user

```http
GET /api/users/:id/followers
```

| Parameter | Type     | Description                                          |
| :-------- | :------- | :--------------------------------------------------- |
| `id`      | `string` | **Required**. ID of the user to fetch followers for. |

---

### Follow or unfollow a user

```http
PATCH /api/users/:id/follow/:utfId
```

| Parameter | Type     | Description                                             |
| :-------- | :------- | :------------------------------------------------------ |
| `id`      | `string` | **Required**. ID of the user to follow/unfollow.        |
| `utfId`   | `string` | **Required**. ID of the user to be followed/unfollowed. |

---

### Create a new post

```http
POST /api/posts
```

Payload should include post details.

---

### Create a new post for a specific user

```http
POST /api/posts/i
```

Payload should include post details for a specific user.

---

### Get posts by user ID

```http
GET /api/posts/:userId
```

| Parameter | Type     | Description                                      |
| :-------- | :------- | :----------------------------------------------- |
| `userId`  | `string` | **Required**. ID of the user to fetch posts for. |

---

### Get all posts

```http
GET /api/posts
```

No parameters required.

---

### Update post by ID

```http
PATCH /api/posts/:id
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. ID of the post to update. |

---

### Delete post by ID

```http
DELETE /api/posts/:id
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. ID of the post to delete. |

---

### Like or unlike a post

```http
PATCH /api/posts/:id/likes
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `string` | **Required**. ID of the post to like/unlike. |

<br>

## To do

EN:

- Add Comment class model and integrate functionality
- Implement Swagger documentation
- Implement testing

ES:

- Agregar modelo e integrar funcionalidades para Comment (comentario)
- Implementar la documentación de Swagger.
- Implementar pruebas
