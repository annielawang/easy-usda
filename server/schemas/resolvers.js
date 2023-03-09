const { AuthenticationError } = require("apollo-server-express");
const { User, Food } = require("../models");
const { signToken } = require("../utils/auth");
const fetch = require("node-fetch");

const resolvers = {
  Query: {
    getFoods: async (_, args) => {
      const {
        query,
        dataType = "",
        pageNumber = "",
        pageSize = "",
        sortBy = "",
        sortOrder = "",
      } = args;
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=blRyZDRgqeBVA3sGp7KTJdcUD1U38l754oWn9CbZ&query=${query}&dataType=${dataType}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      const data = await response.json();
      //console.log("Food data: ", data)
      return data.foods ? data.foods : [];

      // .map(food => ({
      //   fdcId: food.fdcId,
      //   description: food.description,
      //   dataType: food.dataType,
      //   publicationDate: food.publicationDate,
      //   foodNutrients: food.foodNutrients.map(nutrient => ({
      //     number: nutrient.number,
      //     name: nutrient.name,
      //     amount: nutrient.amount,
      //     unitName: nutrient.unitName,
      //     derivationCode: nutrient.derivationCode,
      //     derivationDescription: nutrient.derivationDescription
      //   }))
      // }))
    },

    foodById: async (parent, { args }) => {
      const { fdcId } = args;
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=blRyZDRgqeBVA3sGp7KTJdcUD1U38l754oWn9CbZ`
      );
      const data = await response.json();
      return data;
    },

    foodByName: async (parent, { query }) => {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=blRyZDRgqeBVA3sGp7KTJdcUD1U38l754oWn9CbZ&query=${query}`
      );
      const data = await response.json();
      return [data.foods[0]];
    },

    // By adding context to our query, we can retrieve the logged in user without specifically searching for them

    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        // .select('-__v -password')
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        console.log(username, email, password);
        console.log("before saved4:");
        const user = await User.create({
          username,
          email,
          password,
        });
        console.log("Saved user: ", user);

        const token = signToken(user);

        return { token, user };
      } catch (e) {
        console.error("addUser :", e); //defensive programming
        throw e;
      }
    },
    login: async (parent, { email, password }) => {
      try {
        console.log("login: ", email, password);
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError("No profile with this email found!");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError("Incorrect password!");
        }

        const token = signToken(user);
        return { token, user };
      } catch (e) {
        console.error("login :", e);
        throw e;
      }
    },

    // Add a third argument to the resolver to access data in our `context`
    // addFood: async (parent, { userId, food }) => {
    //   return User.findOneAndUpdate(
    //     { _id: userId },
    //     {
    //       $addToSet: { foods: food },
    //     },
    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    // },
    removeUser: async (parent, { _id }) => {
      return User.findOneAndDelete({ _id: _id });
    },
    removeFood: async (parent, { fdcId }, context) => {
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedFood: { fdcId: fdcId } } }, //could be done in dot notation too
        { new: true }
      );
    },
    saveFood: async (_parent, { food }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          // { $push: { savedFood: food } }, // savedFoods would be part of the User model
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
