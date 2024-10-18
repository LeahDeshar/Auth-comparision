import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import cloudinary from "../utils/cloudinary.js";
const prisma = new PrismaClient();

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
      const userProfilePic = await prisma.cloudinaryImage.findUnique({
        where: { id: user.profilePicId },
      });

      return {
        ...user,
        profilePicId: userProfilePic,
      };
    },
    images: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      const userImage = await prisma.cloudinaryImage.findUnique({
        where: { id: user.profilePicId },
      });

      console.log(userImage);
      return userImage;
    },
  },
  Mutation: {
    async uploadUserProfilePic(parent, { file, userId }, context) {
      console.log("upload");
      const { createReadStream, filename } = await file;
      const stream = createReadStream();

      console.log("success 1");
      let resultUrl = "";
      let resultSecureUrl = "";
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(function (
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url;
            resultSecureUrl = result.secure_url;
            resolve(resultUrl);
          } else {
            reject(error);
          }
        });

        stream.pipe(streamLoad);
      });
      console.log("success 2");
      console.log(cloudinaryResponse);

      // Save image metadata in Prisma
      const cloudinaryImage = await prisma.cloudinaryImage.create({
        data: {
          url: cloudinaryResponse,
          user: { connect: { id: userId } },
        },
      });
      console.log("success 3");

      // Update the user's profilePicId
      await prisma.user.update({
        where: { id: userId },
        data: { profilePicId: cloudinaryImage.id },
      });

      return cloudinaryImage.url;
    },

    async uploadPostImage(parent, { file, postId }, context) {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();

      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );

        stream.pipe(streamLoad);
      });

      // Save image metadata in Prisma
      const cloudinaryImage = await prisma.cloudinaryImage.create({
        data: {
          url: cloudinaryResponse.secure_url,
          post: { connect: { id: postId } },
        },
      });

      // Update the post's postImageId
      await prisma.post.update({
        where: { id: postId },
        data: { postImageId: cloudinaryImage.id },
      });

      return cloudinaryImage.url;
    },

    login: async ({ email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY);
      return { token, user };
    },
  },
};
