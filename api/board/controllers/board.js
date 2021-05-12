"use strict";

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
      return board;
    } catch (error) {
      console.error(error);
      return ctx.send({
        success: false,
      });
    }
  },
};
