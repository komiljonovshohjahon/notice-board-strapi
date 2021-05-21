const { sanitizeEntity } = require("strapi-utils");
var xss = require("xss");

("use strict");

function copyer(sanitized, data) {
  for (const prop in sanitized) {
    data[prop] = sanitized[prop];
  }
}

module.exports = {
  async create(ctx) {
    let entity;

    const options = {};

    const sanitized = {
      name: xss(ctx.request.body.name, options),
      password: xss(ctx.request.body.password, options),
      email: xss(ctx.request.body.email, options),
      number: xss(ctx.request.body.number, options),
      title: xss(ctx.request.body.title, options),
      message: xss(ctx.request.body.message, options),
    };

    try {
      if (ctx.is("multipart")) {
        const { data, files } = parseMultipartData(ctx);
        entity = await strapi.services.board.create(data, { files });
      } else {
        entity = await strapi.services.board.create(
          ctx.request.body,
          copyer(sanitized, ctx.request.body)
        );

        data.created_by = entity.name;
      }
    } catch (error) {
      return error;
    }
  },

  async findOneAndUpdate(ctx) {
    const { id } = ctx.params;
    try {
      const board = await strapi.services.board.findOne({ id });
      await strapi.services.board.update(
        { id: board.id },
        { views: parseInt(board.views) + 1 }
      );

      // console.log(board.password);

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
