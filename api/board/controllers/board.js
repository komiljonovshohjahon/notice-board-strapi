const { sanitizeEntity } = require("strapi-utils");

("use strict");

/*
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOneAndUpdate(ctx) {
    const { id } = ctx.params;
    try {
      const board = await strapi.services.board.findOne({ id });
      await strapi.services.board.update(
        { id: board.id },
        { views: parseInt(board.views) + 1 }
      );

      // return board;
      return sanitizeEntity(board, { model: strapi.models.board });
    } catch (error) {
      console.error(error);
      return ctx.send({
        success: false,
      });
    }
  },

  async findOneAndPassCheck(ctx) {
    const { id } = ctx.params;
    try {
      const board = await strapi.services.board.findOne({ id });

      // BEFORE PRODUCTION DO NOT FORGET TO REMOVE THE BELOW LINE
      console.log(board.password);
      // BEFORE PRODUCTION DO NOT FORGET TO REMOVE THE ABOVE LINE

      if (ctx.request.body === board.password) {
        return sanitizeEntity(board, { model: strapi.models.board });
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return ctx.send({
        success: false,
      });
    }
  },
};

// async findOneAndUpdate(ctx) {
//   const { id } = ctx.params;
//   try {
//     const board = await strapi.services.board.findOne({ id });
//     await strapi.services.board.update(
//       { id: board.id },
//       { views: parseInt(board.views) + 1 }
//     );
//     const new_board = {
//       title: board.title,
//       name: board.name,
//       email: board.email,
//       number: board.number,
//       message: board.message,
//       private: board.private,
//       reply: board.reply,
//       published_at: board.published_at,
//       created_at: board.created_at,
//       updated_at: board.updated_at,
//     };
//     return new_board;
//   } catch (error) {
//     console.error(error);
//     return ctx.send({
//       success: false,
//     });
//   }
// },
//   async find(ctx) {
//     try {
//       const board = await strapi.services.board.find();
//       var new_board = [];
//       board.map((item) =>
//         new_board.push({
//           id: item.id,
//           title: item.title,
//           name: item.name,
//           email: item.email,
//           views: item.views,
//           number: item.number,
//           message: item.message,
//           private: item.private,
//           reply: item.reply,
//           published_at: item.published_at,
//           created_at: item.created_at,
//           updated_at: item.updated_at,
//         })
//       );
//       return new_board;
//     } catch (error) {
//       console.error(error);
//       return ctx.send({
//         success: false,
//       });
//     }
//   },
// };
