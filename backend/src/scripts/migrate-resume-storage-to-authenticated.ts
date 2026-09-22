import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

// One-time migration of legacy public objects.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

async function main() {
  const resumes = await prisma.resume.findMany({
    where: { filePath: { not: null } },
    select: { id: true, filePath: true },
  });

  let migrated = 0;
  for (const resume of resumes) {
    await cloudinary.uploader.rename(resume.filePath!, resume.filePath!, {
      resource_type: "raw",
      type: "upload",
      to_type: "authenticated",
      overwrite: true,
      invalidate: true,
    });
    migrated += 1;
  }
  console.log(`Migrated ${migrated} resume objects to authenticated delivery`);
}

main()
  .catch((error) => {
    console.error("Resume storage migration failed", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
