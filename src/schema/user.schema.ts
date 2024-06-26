import { TypeOf, literal, object, string } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: "FirstName is required" }),
    lastName: string({ required_error: "LastName is required" }),
    password: string({ required_error: "Password is required" }).min(
      7,
      "Password too short - it should contain at least 7 characters"
    ),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({ required_error: "Email is required" }),
  }).refine((data) => data.password == data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

// const createPayload = {
//   body: object({
//     firstName: string({ required_error: "FirstName is required" }),
//     lastName: string({ required_error: "LastName is required" }),
//     password: string({ required_error: "Password is required" }).min(
//       7,
//       "Password too short - it should contain at least 7 characters"
//     ),
//     passwordConfirmation: string({
//       required_error: "Password confirmation is required",
//     }),
//     email: string({ required_error: "Email is required" }),
//   }).refine((data) => data.password == data.passwordConfirmation, {
//     message: "Passwords do not match",
//     path: ["passwordConfirmation"],
//   }),
// }
// export const createUserSchema = object({
//   ...createPayload
// })

// export const searchUserSchema = object({
//   query: object({
//     user: string(),
//     field: string(),
//     direction: literal("desc"|"asc").default("desc")
//   }),
// });

export type CreateUserInput = TypeOf<typeof createUserSchema>;
// export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>,"body.passwordConfirmation">;
// export type SearchUserInput = TypeOf<typeof searchUserSchema>;
