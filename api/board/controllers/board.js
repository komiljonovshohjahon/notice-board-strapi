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

  async update(ctx) {
    const { id } = ctx.params;

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
        entity = await strapi.services.board.update({ id }, data, {
          files,
        });
      } else {
        entity = await strapi.services.board.update(
          { id },
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

      console.log(board.password);

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

    const options = {};

    const sanitized = {
      password: xss(ctx.request.body, options),
    };

    try {
      const board = await strapi.services.board.findOne({ id });

      // BEFORE PRODUCTION DO NOT FORGET TO REMOVE THE BELOW LINE
      // console.log(board.password);
      // BEFORE PRODUCTION DO NOT FORGET TO REMOVE THE ABOVE LINE

      if (ctx.request.body === board.password) {
        board.password = sanitized.password;

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

  async count(ctx) {
    if (ctx.query._q) {
      return strapi.services.board.countSearch(ctx.query);
    }
    return strapi.services.board.count(ctx.query);
  },
};
