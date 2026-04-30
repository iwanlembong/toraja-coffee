const prisma = require("./client");

async function main() {
  const category = await prisma.category.create({
    data: {
      name: "Kopi Toraja"
    }
  });

  await prisma.product.create({
    data: {
      name: "Arabica Sapan Toraja",
      slug: "arabica-sapan-toraja",
      description: "Kopi premium dari dataran tinggi Toraja",
      price: 120000,
      stock: 50,
      categoryId: category.id
    }
  });

  console.log("Seed success");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());