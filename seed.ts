import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // First, create some categories
  const categories = await Promise.all(
    ["Tech", "Life", "Business"].map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: {
          name,
          slug: name.toLowerCase(),
        },
      })
    )
  );

  // Create 30 blog posts
  for (let i = 1; i <= 20; i++) {
    const category = faker.helpers.arrayElement(categories);
    const published = i % 2 === 0;
    const createdAt = faker.date.past();
    const publishedAt = published ? createdAt : null;

    await prisma.blog.create({
      data: {
        title: `Seeded Blog Post #${i}`,
        excerpt: faker.lorem.sentence(),
        slug: `seeded-post-${i}`,
        body: faker.lorem.paragraphs(5),
        readTime: `${faker.number.int({ min: 2, max: 8 })} min read`,
        published,
        publishedAt,
        categoryId: category.id,
        tags: faker.helpers.arrayElements(
          ["react", "dev", "tips", "career", "nextjs", "design"],
          faker.number.int({ min: 1, max: 3 })
        ),
        views: faker.number.int({ min: 0, max: 500 }),
        likes: faker.number.int({ min: 0, max: 100 }),
        metaTitle: `Meta Title for Post #${i}`,
        metaDescription: faker.lorem.sentence(),
        ogImage: faker.image.urlPicsumPhotos(),
        createdAt,
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Seed complete");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seed failed", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
