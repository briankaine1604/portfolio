import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Reuse or create categories
  const categories = await Promise.all(
    ["Tech", "Design", "AI"].map((name) =>
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

  // Create 20 projects
  for (let i = 1; i <= 20; i++) {
    const category = faker.helpers.arrayElement(categories);
    const createdAt = faker.date.past();
    const completed = i % 3 === 0;
    const completedAt = completed
      ? faker.date.between({ from: createdAt, to: new Date() })
      : null;

    await prisma.project.create({
      data: {
        title: `Seeded Project #${i}`,
        slug: `seeded-project-${i}`,
        description: faker.lorem.sentence(),
        tech: faker.helpers.arrayElements(
          [
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "Prisma",
            "Tailwind",
            "GSAP",
          ],
          faker.number.int({ min: 2, max: 4 })
        ),
        status: faker.helpers.arrayElement([
          "LIVE",
          "IN_PROGRESS",
          "COMPLETED",
          "ARCHIVED",
        ]),
        liveUrl: faker.internet.url(),
        githubUrl: faker.internet.url(),
        caseStudyUrl: faker.internet.url(),
        thumbnail: faker.image.urlPicsumPhotos(),
        images: Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          () => faker.image.urlPicsumPhotos()
        ),
        videoUrl: faker.internet.url(),
        longDescription: faker.lorem.paragraphs(3),
        challenges: faker.lorem.paragraphs(2),
        learnings: faker.lorem.paragraphs(2),
        featured: i % 5 === 0,
        priority: faker.number.int({ min: 0, max: 10 }),
        categoryId: category.id,
        metaTitle: `Meta Title for Project #${i}`,
        metaDescription: faker.lorem.sentence(),
        ogImage: faker.image.urlPicsumPhotos(),
        views: faker.number.int({ min: 0, max: 1000 }),
        likes: faker.number.int({ min: 0, max: 200 }),
        createdAt,
        completedAt,
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Project seed complete");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Project seed failed", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
