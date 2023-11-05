const express = require("express");
const { PrismaClient } = require("./../../prisma/generated/client");
const prisma = new PrismaClient();
const router = express.Router();

const isAuthenticated = require("./../middlewares/isAuthenticated");

router.post("/", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  try {
    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId: req.user.id,
      },
    });

    return res.json({ message: "Board created successfully", board });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the board" });
  }
});

router.post("/:boardId/cards", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const { boardId } = req.params;

  const board = await prisma.board.findFirst({
    where: {
      id: parseInt(boardId),
      userId: req.user.id,
    },
  });

  if (!board) {
    return res.status(404).json({ error: "Board not found or unauthorized" });
  }

  try {
    const card = await prisma.card.create({
      data: {
        title,
        description,
        boardId: parseInt(boardId),
      },
    });

    return res.json({ message: "Card added to the board successfully", card });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while adding the card" });
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        cards: true,
      },
    });

    return res.json({ boards });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching boards" });
  }
});

module.exports = router;
