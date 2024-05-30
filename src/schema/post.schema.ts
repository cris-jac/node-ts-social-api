import { TypeOf, object, string } from "zod";

// const params = {
//   params: object({
//     user: string({ required_error: "User id is required" }),
//   }),
// };

// const body = {
//   body: object({
//     description: string({ required_error: "Description is required" }),
//   }),
// };

// const bodyWithImage = {
//   body: object({
//     description: string({ required_error: "Description is required" }),
//     picture: string({ required_error: "Picture path is required" }),
//   }),
// };

// export const createPostSchema = object({
//   ...body,
//   ...params,
// });

// export const createPostWithImageSchema = object({
//   ...params,
//   ...bodyWithImage,
// });

export const createPostSchema = object({
  body: object({
    user: string({ required_error: "User id is required" }),
    description: string({ required_error: "Description is required" }),
  }),
  //     picture: string({ required_error: "Picture path is required" }),
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;
// export type CreatePostWithImageInput = TypeOf<typeof createPostWithImageSchema>;
